import type { SlideDeck } from '@mindfiredigital/mdslide-shared';
import { renderSlide } from './renderSlide.js';
import { sanitizeHtml } from '../../utils/html.js';
import { script } from './script.js';
import { RenderDeckOptions } from '../../interfaces/index.js';
import { DEFAULT_TITLE } from '../../constants/index.js';
export * from './renderSlide.js';

export function renderDeck(deck: SlideDeck, options: RenderDeckOptions = {}): string {
  const theme = options.theme ?? String(deck.meta?.theme);
  const title = String(deck.meta?.title ?? DEFAULT_TITLE);
  const slidesHtml = deck.slides.map(renderSlide).join('\n');

  return `<!DOCTYPE html>
<html lang="en" data-theme="${sanitizeHtml(theme)}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${sanitizeHtml(title)}</title>
</head>
<body>
  <div class="deck">
${slidesHtml}
  </div>

  <!-- Progress Bar -->
  <div class="progressBarContainer">
    <div id="progressBar" class="progressBar"></div>
  </div>

  <!-- DOK Control bar -->
  <div class="dokContainer">
    <button id="dokPrev" class="dokBtn" title="Previous Slide">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </button>
    <span id="dokCounter" class="dokCounter">1 / 1</span>
    <button id="dokNext" class="dokBtn" title="Next Slide">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </button>
    <button id="dokFullscreen" class="dokBtn" title="Toggle Fullscreen (F)">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
    </button>
  </div>

  ${script}
</body>
</html>`;
}
