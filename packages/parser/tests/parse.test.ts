import { describe, it, expect } from 'vitest';
import { parse } from '../src/parse.js';

describe('parse', () => {
  it('parse a simple paragraph to slide', () => {
    const result = parse('hello world');
    expect(result).toHaveLength(1);
    expect(result[0].content[0].type).toBe('paragraph');
  });

  it('---  : splits into two slides', () => {
    const result = parse(`
first slide
---
second slide
        `);

    expect(result).toHaveLength(2);
  });

  it('# sets the title on the slide', () => {
    const result = parse(`
# My Presentation

some content
        `);

    expect(result[0].title).toBe('My Presentation');
  });

  it('## starts a new slide with that title', () => {
    const result = parse(`
## Intro

some content
        `);

    const slide = result.find((s) => s.title === 'Intro');
    expect(slide).toBeDefined();
    expect(slide!.content[0].type).toBe('paragraph');
  });

  it('bullet list is present then slide detected as bullets layout', () => {
    const result = parse(`
## Features

- fast
- simple
- reliable
        `);

    const slide = result.find((s) => s.title === 'Features');
    expect(slide).toBeDefined();
    expect(slide!.type).toBe('bullets');
  });

  it('title is present then slide detected as title layout', () => {
    const result = parse('# My Presentation');
    expect(result[0].type).toBe('title');
  });
});
