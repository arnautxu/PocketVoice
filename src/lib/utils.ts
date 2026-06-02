/**
 * Minimal `cn` class-name joiner (shadcn/ForgeUI components expect `cn` from
 * `@/lib/utils`). This project doesn't ship clsx/tailwind-merge, and the only
 * consumer (ForgeUI Cloudscape) calls `cn("static classes", className)` — a
 * plain truthy-join is sufficient. Swap for clsx + tailwind-merge if a future
 * component needs conditional/conflicting class resolution.
 */
type ClassValue = string | number | null | false | undefined;

export function cn(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(' ');
}
