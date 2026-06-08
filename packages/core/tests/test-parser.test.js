import { parseMarkdown } from '../src/parser/markdownParser.ts';
import { normalizeSlides } from '../src/normalizer/mdAstToSlideBasedAst.ts';
import fs from 'fs';
import path from 'path';
import { runTransforms } from '../src/transformers/index.ts';
import { processOverflow } from '../src/overflow/index.ts';
import { parseFrontmatter } from '@mindfiredigital/mdslide-shared';
import { renderDeck } from '../src/renderer/html/index.ts';

const filePath = path.resolve(__dirname, 'test.md');
const newMarkDown = fs.readFileSync(filePath, { encoding: 'utf-8' });

const markdown = `---
title: Notion Slide
theme: notion
---

# Introduction to mdslide
This is our brand new compiler core.
<!-- notes -->
This is a speaker note for slide 1.
<!-- /notes -->

---

## What is a Slide?
<!-- layout: bullets -->
- Bullet 1
- Bullet 2

<!-- notes -->
Make sure to explain layout overrides.
<!-- /notes -->
`;

const { meta, content } = parseFrontmatter(newMarkDown);

console.log('STEP 1: RAW MDAST PARSER OUTPUT (BEFORE NORMALIZATION)');

const parseResult = parseMarkdown(newMarkDown);

console.log('STEP 2: SLIDE-BASED AST OUTPUT (AFTER NORMALIZATION / RESOLVING)');

const normalizedSlides = normalizeSlides(parseResult.slides);

const transformedSlides = runTransforms(normalizedSlides);

const slides = processOverflow(transformedSlides);

const deck = { meta, slides };
const html = renderDeck(deck);
fs.writeFileSync('output.html', html);
