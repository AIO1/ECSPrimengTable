import { DEFAULT_TABLE_OPTIONS, ITableOptions } from '../interfaces';

/**
 * Deep merge two objects.
 * Recursively copies properties from `source` into `target`,
 * but ignores `undefined` values to preserve defaults.
 */
function deepMerge<T>(target: T, source: Partial<T>): T {
  for (const key in source) {
    const value = source[key];

    if (value === undefined) { // skip undefined values to keep defaults
      continue;
    }

    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      if (!target[key]) (target as any)[key] = {};
      deepMerge((target as any)[key], value);
    } else {
      (target as any)[key] = value;
    }
  }
  return target;
}

/**
 * Create table options based on defaults, with optional overrides.
 */
export function createTableOptions(overrides: Partial<ITableOptions> = {}): ITableOptions {
  const defaultsCopy = JSON.parse(JSON.stringify(DEFAULT_TABLE_OPTIONS)); // clona solo datos
  const merged = deepMerge(defaultsCopy as any, overrides);

  // reasignar funciones si existen en overrides
  if (overrides.rows?.style) merged.rows.style = overrides.rows.style;
  if (overrides.rows?.class) merged.rows.class = overrides.rows.class;

  return merged as ITableOptions;
}