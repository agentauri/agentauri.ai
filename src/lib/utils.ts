import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with intelligent conflict resolution
 *
 * Combines `clsx` for conditional class handling with `tailwind-merge`
 * for proper Tailwind class deduplication and conflict resolution.
 *
 * @param inputs - Class values (strings, objects, arrays, conditionals)
 * @returns Merged class string with conflicts resolved
 *
 * @example
 * ```tsx
 * // Basic usage
 * cn('px-4 py-2', 'bg-blue-500')
 * // => 'px-4 py-2 bg-blue-500'
 * ```
 *
 * @example
 * ```tsx
 * // Conditional classes
 * cn('btn', isActive && 'btn-active', isDisabled && 'btn-disabled')
 * // => 'btn btn-active' (if isActive=true, isDisabled=false)
 * ```
 *
 * @example
 * ```tsx
 * // Conflict resolution (later classes win)
 * cn('px-4 py-2', 'px-8')
 * // => 'py-2 px-8' (px-8 overrides px-4)
 * ```
 *
 * @example
 * ```tsx
 * // Component with variant override
 * function Button({ className, ...props }) {
 *   return (
 *     <button
 *       className={cn(
 *         'px-4 py-2 bg-primary text-white',
 *         className // Allows override via props
 *       )}
 *       {...props}
 *     />
 *   )
 * }
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
