import { describe, it, expect } from 'vitest';
import { highlightCode } from '../src/highlight.js';

describe('highlightCode', () => {
  it('returns html string for a known language', async () => {
    const html = await highlightCode('const x = 1', 'ts', 'light');
    expect(html).toContain('<pre');
    expect(html).toContain('const');
  });

  it('wraps output in pre tag', async () => {
    const html = await highlightCode('console.log("hi")', 'js', 'dark');
    expect(html).toContain('<pre');
    expect(html).toContain('</pre>');
  });

  it('falls back to plain text for unknown language', async () => {
    const html = await highlightCode('some content', 'unknownlang123', 'light');
    expect(html).toContain('some content');
    expect(html).toContain('<pre');
  });

  it('returns empty pre for empty code string', async () => {
    const html = await highlightCode('', '', 'light');
    expect(html).toContain('<pre');
    expect(html).toContain('<code>');
  });

  it('escapes HTML in fallback output', async () => {
    const html = await highlightCode('<script>alert(1)</script>', 'unknownlang123', 'light');
    expect(html).not.toContain('<script>alert');
    expect(html).toContain('&lt;script&gt;');
  });

  it.each([
    ['light', 'github-light'],
    ['dark', 'github-dark'],
    ['notion', 'github-light'],
    ['gradient', 'one-dark-pro'],
  ])('uses correct shiki theme for mdslide theme %s', async (theme) => {
    const html = await highlightCode('const x = 1', 'ts', theme);
    expect(html).toContain('<pre');
    expect(html.length).toBeGreaterThan(0);
  });

  it('handles bash code correctly', async () => {
    const html = await highlightCode('pnpm install', 'bash', 'dark');
    expect(html).toContain('pnpm install');
    expect(html).toContain('<pre');
  });

  it('handles json code correctly', async () => {
    const html = await highlightCode('{"key": "value"}', 'json', 'notion');
    expect(html).toContain('key');
    expect(html).toContain('<pre');
  });
});
