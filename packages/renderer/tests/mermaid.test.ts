import { describe, it, expect } from 'vitest';
import { renderMermaid } from '../src/mermaid.js';

describe('renderMermaid', () => {
  it('returns a pre with mermaid class for a valid definition', () => {
    const html = renderMermaid('graph TD\n  A --> B');
    expect(html).toContain('class="mermaid"');
    expect(html).toContain('graph TD');
  });

  it('escapes HTML inside the definition', () => {
    const html = renderMermaid('<script>alert(1)</script>');
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('returns empty string for empty definition', () => {
    expect(renderMermaid('')).toBe('');
    expect(renderMermaid('   ')).toBe('');
  });

  it('handles flowchart syntax', () => {
    const html = renderMermaid('flowchart LR\n  A --> B --> C');
    expect(html).toContain('flowchart LR');
    expect(html).toContain('class="mermaid"');
  });

  it('handles sequence diagram syntax', () => {
    const html = renderMermaid('sequenceDiagram\n  Alice->>Bob: Hello');
    expect(html).toContain('sequenceDiagram');
    expect(html).toContain('class="mermaid"');
  });

  it('output is a string', () => {
    expect(typeof renderMermaid('graph TD\n  A --> B')).toBe('string');
  });
});
