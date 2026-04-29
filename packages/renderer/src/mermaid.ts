export function renderMermaid(definition: string): string {
  if (!definition.trim()) return '';
  return `<div class="mermaid">${definition}</div>`;
}
