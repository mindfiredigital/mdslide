import { unified } from 'unified';
import remarkParse from 'remark-parse';
import type { Root } from 'mdast';
import type { Slide } from '@mindfiredigital/mdslide-shared';

import { splitSlides } from './split.js';
import { detectLayout } from './detect-layout.js';

export function parse(markdown: string): Slide[] {
  const tree = unified().use(remarkParse).parse(markdown) as Root;

  const slides = splitSlides(tree);
  return slides.map(detectLayout);
}
