export type TreeKey = string | number;
export type TreeRow = Record<string, unknown>;
export type TreeLoadMode = 'all' | 'onDemand' | 'pagedChildren';

export interface ITreeTableOptions {
  keyExpr: string;
  parentIdExpr: string;
  rootValue?: TreeKey | null;
  hasItemsExpr?: string;
  column: string;
  loadMode?: TreeLoadMode;
}

export interface ITreeResponse {
  data: TreeRow[];
  page: number;
  totalRecords: number;
  totalRecordsNotFiltered: number;
  ancestorKeys?: TreeKey[];
}

export interface ITreeRequest {
  roots: boolean;
  parentId: TreeKey | null;
  loadMode: TreeLoadMode;
  page: number;
  pageSize: number;
}

interface TreeEntry {
  row: TreeRow;
  depth: number;
  parent?: TreeKey;
  more?: boolean;
}

export class TreeTableState {
  readonly expanded = new Set<TreeKey>();
  private readonly nodes = new Map<TreeKey, TreeRow>();
  private readonly children = new Map<TreeKey, TreeKey[]>();
  private readonly totals = new Map<TreeKey, number>();
  private readonly pages = new Map<TreeKey, number>();
  private entries = new WeakMap<TreeRow, TreeEntry>();
  private roots: TreeKey[] = [];
  private allRoots: TreeKey[] = [];
  private version = 0;
  private readonly pending = new Set<TreeKey>();
  private restoredPages: Record<string, number> = {};
  visible: TreeRow[] = [];
  loading = false;
  page = 0;
  pageSize = 10;
  totalRecords = 0;
  totalRecordsNotFiltered = 0;

  constructor(readonly options: ITreeTableOptions) {
    if (!options.keyExpr?.trim() || !options.parentIdExpr?.trim() || !options.column?.trim()) {
      throw new Error('Tree configuration requires keyExpr, parentIdExpr and column.');
    }
    if (!['all', 'onDemand', 'pagedChildren'].includes(this.mode)) {
      throw new Error('Invalid tree loadMode.');
    }
    if (this.mode !== 'all' && !options.hasItemsExpr?.trim()) {
      throw new Error('Remote tree loading requires hasItemsExpr.');
    }
  }

  get mode(): TreeLoadMode { return this.options.loadMode ?? 'onDemand'; }
  get rootValue(): TreeKey | null { return this.options.rootValue === undefined ? 0 : this.options.rootValue; }

  key(row: TreeRow): TreeKey {
    const key = row[this.options.keyExpr];
    if ((typeof key !== 'string' && typeof key !== 'number') || key === '' ||
        (typeof key === 'number' && !Number.isFinite(key))) {
      throw new Error('Tree keys must be non-empty strings or finite numbers.');
    }
    return key;
  }

  restore(keys: TreeKey[] = [], pages: Record<string, number> = {}): void {
    this.expanded.clear();
    keys.forEach(key => this.expanded.add(key));
    this.restoredPages = { ...pages };
  }

  snapshotPages(): Record<string, number> {
    return Object.fromEntries([...this.pages].map(([key, page]) => [JSON.stringify(key), page]));
  }

  depth(row: TreeRow): number { return this.entries.get(row)?.depth ?? 0; }
  isMore(row: TreeRow): boolean { return !!this.entries.get(row)?.more; }
  moreParent(row: TreeRow): TreeKey | undefined { return this.entries.get(row)?.parent; }
  isExpanded(row: TreeRow): boolean { return this.expanded.has(this.key(row)); }
  isLoading(row: TreeRow): boolean { return this.pending.has(this.key(row)); }
  hasChildren(row: TreeRow): boolean {
    if (this.mode === 'all') return !!this.children.get(this.key(row))?.length;
    return row[this.options.hasItemsExpr!] === true;
  }

  cancel(): void { this.version++; this.loading = false; this.pending.clear(); }

  async load(page: number, pageSize: number, fetch: (request: ITreeRequest) => Promise<ITreeResponse>): Promise<boolean> {
    const version = ++this.version;
    this.loading = true;
    this.pending.clear();
    this.nodes.clear(); this.children.clear(); this.totals.clear(); this.pages.clear();
    this.visible = [];
    this.page = page; this.pageSize = pageSize;
    try {
      const response = await fetch({ roots: true, parentId: this.rootValue, loadMode: this.mode, page, pageSize });
      if (version !== this.version) return false;
      this.insert(response.data);
      this.page = response.page;
      this.totalRecords = response.totalRecords;
      this.totalRecordsNotFiltered = response.totalRecordsNotFiltered;
      if (this.mode === 'all') {
        this.buildAll();
        this.page = Math.min(Math.max(0, page), Math.max(0, Math.ceil(this.allRoots.length / pageSize) - 1));
        this.roots = this.allRoots.slice(this.page * pageSize, (this.page + 1) * pageSize);
      } else {
        this.roots = response.data.map(row => this.key(row));
      }
      response.ancestorKeys?.forEach(key => this.expanded.add(key));
      const queue = [...this.roots];
      for (let cursor = 0; cursor < queue.length; cursor++) {
        const key = queue[cursor];
        const row = this.nodes.get(key)!;
        if (!this.expanded.has(key) || !this.hasChildren(row)) continue;
        if (this.mode !== 'all') {
          await this.fetchChildren(key, 0, fetch, version);
          const targetPage = this.restoredPages[JSON.stringify(key)] ?? 0;
          while (version === this.version && this.mode === 'pagedChildren' &&
              (this.pages.get(key) ?? 0) < targetPage && this.hasMore(key)) {
            await this.fetchChildren(key, (this.pages.get(key) ?? 0) + 1, fetch, version);
          }
        }
        if (version !== this.version) return false;
        queue.push(...(this.children.get(key) ?? []));
      }
      this.restoredPages = {};
      this.rebuild();
      return true;
    } finally {
      if (version === this.version) this.loading = false;
    }
  }

  async toggle(row: TreeRow, fetch: (request: ITreeRequest) => Promise<ITreeResponse>): Promise<void> {
    const key = this.key(row);
    if (this.pending.has(key)) return;
    if (this.expanded.delete(key)) { this.rebuild(); return; }
    this.expanded.add(key);
    const version = this.version;
    try {
      const queue = [key];
      for (let cursor = 0; cursor < queue.length; cursor++) {
        const current = queue[cursor];
        if (this.mode !== 'all' && !this.children.has(current)) await this.fetchChildren(current, 0, fetch, version);
        if (version !== this.version) return;
        for (const child of this.children.get(current) ?? []) {
          if (this.expanded.has(child) && this.hasChildren(this.nodes.get(child)!)) queue.push(child);
        }
      }
      this.rebuild();
    } catch (error) {
      if (version === this.version) this.expanded.delete(key);
      throw error;
    }
  }

  async loadMore(row: TreeRow, fetch: (request: ITreeRequest) => Promise<ITreeResponse>): Promise<void> {
    const parent = this.moreParent(row);
    if (parent === undefined || this.pending.has(parent)) return;
    const version = this.version;
    await this.fetchChildren(parent, (this.pages.get(parent) ?? 0) + 1, fetch, version);
    if (version === this.version) this.rebuild();
  }

  private insert(rows: TreeRow[]): void {
    const keys = new Set<TreeKey>();
    for (const row of rows) {
      const key = this.key(row);
      if (keys.has(key) || this.nodes.has(key)) throw new Error('Duplicate tree key.');
      keys.add(key);
    }
    for (const row of rows) this.nodes.set(this.key(row), row);
  }

  private buildAll(): void {
    this.allRoots = [];
    for (const [key, row] of this.nodes) {
      const parent = row[this.options.parentIdExpr];
      if (parent === this.rootValue) this.allRoots.push(key);
      else {
        if (!this.nodes.has(parent as TreeKey)) throw new Error('Missing tree parent.');
        const siblings = this.children.get(parent as TreeKey) ?? [];
        siblings.push(key); this.children.set(parent as TreeKey, siblings);
      }
    }
    const seen = new Set<TreeKey>();
    const queue = [...this.allRoots];
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const key = queue[cursor];
      if (seen.has(key)) throw new Error('Tree cycle.');
      seen.add(key); queue.push(...(this.children.get(key) ?? []));
    }
    if (seen.size !== this.nodes.size) throw new Error('Tree cycle.');
  }

  private async fetchChildren(key: TreeKey, page: number, fetch: (request: ITreeRequest) => Promise<ITreeResponse>, version: number): Promise<void> {
    this.pending.add(key);
    try {
      const response = await fetch({ roots: false, parentId: key, loadMode: this.mode, page, pageSize: this.pageSize });
      if (version !== this.version) return;
      for (const row of response.data) {
        if (row[this.options.parentIdExpr] !== key) throw new Error('Unexpected tree parent.');
      }
      this.insert(response.data);
      this.children.set(key, [...(this.children.get(key) ?? []), ...response.data.map(row => this.key(row))]);
      this.totals.set(key, response.totalRecords);
      this.pages.set(key, response.page);
      response.ancestorKeys?.forEach(ancestor => this.expanded.add(ancestor));
    } finally {
      if (version === this.version) this.pending.delete(key);
    }
  }

  private hasMore(key: TreeKey): boolean {
    return (this.children.get(key)?.length ?? 0) < (this.totals.get(key) ?? 0);
  }

  private rebuild(): void {
    this.entries = new WeakMap();
    const result: TreeRow[] = [];
    const stack: TreeEntry[] = this.roots.map(key => ({ row: this.nodes.get(key)!, depth: 0 })).reverse();
    while (stack.length) {
      const entry = stack.pop()!;
      this.entries.set(entry.row, entry); result.push(entry.row);
      if (entry.more) continue;
      const key = this.key(entry.row);
      if (!this.expanded.has(key)) continue;
      if (this.hasMore(key)) stack.push({ row: {}, depth: entry.depth + 1, parent: key, more: true });
      const children = this.children.get(key) ?? [];
      for (let index = children.length - 1; index >= 0; index--) {
        stack.push({ row: this.nodes.get(children[index])!, depth: entry.depth + 1, parent: key });
      }
    }
    this.visible = result;
  }
}