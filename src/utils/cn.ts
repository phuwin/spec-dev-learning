/**
 * Utility function for combining class names
 * Similar to clsx but simpler for this project
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
