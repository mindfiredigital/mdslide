import { describe, it, expect } from 'vitest';
import { renderSlide, renderDeck } from '../src/html.js';
import type { Slide, SlideDeck } from '@mindfiredigital/mdslide-shared';

const slide = (overrides: Partial<Slide> = {}): Slide => ({
  id: '1',
  type: 'content',
  title: 'Hello',
  content: [{ type: 'paragraph', children: [{ type: 'text', value: 'World' }] }],
  notes: undefined,
  ...overrides,
});

const deck = (overrides: Partial<SlideDeck> = {}): SlideDeck => ({
  meta: { title: 'My Deck', theme: 'light' },
  slides: [slide()],
  ...overrides,
});
describe('renderSlide', () => {
  it('wraps slide in section with correct data attributes', async () => {
    const html = await renderSlide(slide());
    expect(html).toContain('data-type="content"');
    expect(html).toContain('data-id="1"');
    expect(html).toContain('<h2 class="slide-title">Hello</h2>');
    expect(html).toContain('<div class="slide-content">');
    expect(html).toContain('<p>World</p>');
  });
  it('skips the title element when title is absent', async () => {
    const html = await renderSlide(slide({ title: undefined }));
    expect(html).not.toContain('slide-title');
  });

  it('renders notes as a hidden aside', async () => {
    const html = await renderSlide(slide({ notes: 'remember this' }));
    expect(html).toContain('<aside class="notes" hidden>');
    expect(html).toContain('remember this');
  });

  it('escapes HTML in title and notes', async () => {
    const html = await renderSlide(slide({ title: '<b>XSS</b>', notes: '<script>' }));
    expect(html).toContain('&lt;b&gt;XSS&lt;/b&gt;');
    expect(html).toContain('&lt;script&gt;');
  });
});

describe('renderDeck', () => {
  it('produces a full HTML document with both style blocks', async () => {
    const html = await renderDeck(deck());
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<title>My Deck</title>');
    expect(html).toContain('id="mdslide-base"');
    expect(html).toContain('id="mdslide-theme"');
  });

  it('includes slide counter and nav script', async () => {
    const html = await renderDeck(deck());
    expect(html).toContain('id="slide-counter"');
    expect(html).toContain('<script>');
  });

  it('falls back to Presentation when meta title is missing', async () => {
    const html = await renderDeck(deck({ meta: {} }));
    expect(html).toContain('<title>Presentation</title>');
  });

  it('prefers CLI theme over meta theme', async () => {
    const light = await renderDeck(deck(), { theme: 'light' });
    const dark = await renderDeck(deck(), { theme: 'dark' });
    expect(light).not.toEqual(dark);
  });
});
