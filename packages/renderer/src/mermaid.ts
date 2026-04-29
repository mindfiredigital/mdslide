export async function renderMermaid(definition: string): Promise<string> {
  if (!definition.trim()) {
    return `<pre class="mermaid-fallback"><code>${escapeHtml(definition)}</code></pre>`;
  }

  try {
    // mermaid needs a DOM environment
    const { default: mermaid } = await import('mermaid');

    mermaid.initialize({
      startOnLoad: false,
      theme: 'neutral',
    });

    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
    const { svg } = await mermaid.render(id, definition.trim());

    return `<div class="mermaid-diagram">${svg}</div>`;
  } catch (err) {
    // syntax error or unsupported diagram
    return `
<div class="mermaid-fallback">
  <p class="mermaid-warning">Diagram could not be rendered</p>
  <pre><code>${escapeHtml(definition)}</code></pre>
</div>`;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
