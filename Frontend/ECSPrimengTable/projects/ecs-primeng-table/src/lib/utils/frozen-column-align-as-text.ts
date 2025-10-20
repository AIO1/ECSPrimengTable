import { FrozenColumnAlign } from "../enums";

/**
 * Converts a `FrozenColumnAlign` enum value to its corresponding CSS alignment string.
 *
 * @param frozenColumnAlign - The frozen column alignment enum value.
 * @returns The CSS alignment string ('left' or 'right').
 *
 * @remarks
 * If an unknown value is provided, the function defaults to 'left'.
 */
export function frozenColumnAlignAsText(frozenColumnAlign: FrozenColumnAlign): string {
  switch (frozenColumnAlign) {
    case FrozenColumnAlign.Left:
      return 'left';
    case FrozenColumnAlign.Right:
      return 'right';
    default:
      return 'left';
  }
}