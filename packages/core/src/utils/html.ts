/*
 * Encodes dangerous characters into safe HTML entities to prevent
 * layout breakage and text rendering bugs on slides.
 */

export function sanitizeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
