import { Injectable, OnDestroy } from '@angular/core';
import { FilterMetadata, SortMeta } from 'primeng/api';

/** Transient query state only; rows and row selections are never cached. */
export interface ITableNavigationState {
  configurationUrl: string;
  dataUrl: string;
  filters: Record<string, FilterMetadata | FilterMetadata[]>;
  multiSortMeta: SortMeta[];
  globalSearchText: string | null;
  currentPage: number;
  currentRowsPerPage: number;
}

/**
 * Provide on the parent COMPONENT containing the list and detail router outlet.
 * Do not provide at application/root level or on the list component itself.
 * Destroying that parent ends the scope and discards all its table states.
 */
@Injectable()
export class ECSPrimengTableStateService implements OnDestroy {
  private readonly states = new Map<string, ITableNavigationState>();
  private destroyed = false;

  get(key: string): ITableNavigationState | undefined {
    const state = this.states.get(key);
    return state ? structuredClone(state) : undefined;
  }

  set(key: string, state: ITableNavigationState): void {
    // Parent and child destruction order must not resurrect a discarded scope.
    if (!this.destroyed) this.states.set(key, structuredClone(state));
  }

  clear(key?: string): void {
    if (key === undefined) this.states.clear();
    else this.states.delete(key);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.clear();
  }
}
