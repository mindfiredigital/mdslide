import type { Slide, SlideNode } from '@mindfiredigital/mdslide-shared';
import { renderCodeBlock, renderInlineCode } from './renderCode.js';
import { renderTable, renderTableRow, renderTableCell } from './renderTable.js';
import { sanitizeHtml } from '../../utils/index.js';

export function childrenToHtml(node: SlideNode): string {
  return (node.children ?? []).map(nodeToHtml).join('');
}

export function nodeToHtml(node: SlideNode): string {
  switch (node.type) {
    case 'paragraph':
      return `<p>${childrenToHtml(node)}</p>`;

    case 'text':
      return sanitizeHtml(node.value ?? '');

    case 'strong':
      return `<strong>${childrenToHtml(node)}</strong>`;

    case 'emphasis':
      return `<em>${childrenToHtml(node)}</em>`;

    case 'inlineCode':
      return renderInlineCode(node);

    case 'code':
      return renderCodeBlock(node);

    case 'list': {
      const tag = node.ordered ? 'ol' : 'ul';
      return `<${tag}>${childrenToHtml(node)}</${tag}>`;
    }

    case 'listItem':
      return `<li>${childrenToHtml(node)}</li>`;

    case 'blockquote':
      return `<blockquote>${childrenToHtml(node)}</blockquote>`;

    case 'image': {
      const src = node.url ?? node.value ?? '';
      const alt = node.alt ?? '';
      return `<img src="${sanitizeHtml(src)}" alt="${sanitizeHtml(alt)}" />`;
    }

    case 'link': {
      const href = node.url ?? node.value ?? '';
      return `<a href="${sanitizeHtml(href)}">${childrenToHtml(node)}</a>`;
    }

    case 'table':
      return renderTable(node, childrenToHtml);

    case 'tableRow':
      return renderTableRow(node, childrenToHtml);

    case 'tableCell':
      return renderTableCell(node, childrenToHtml);

    case 'break':
      return '<br />';

    case 'html':
      return '';

    case 'column':
      return childrenToHtml(node);

    default:
      if (node.value) {
        return sanitizeHtml(node.value);
      }
      if (node.children?.length) {
        return childrenToHtml(node);
      }
      return '';
  }
}

export function renderNotes(notes: string | undefined): string {
  if (!notes) return '';
  return `<aside class="notes" hidden>${sanitizeHtml(notes)}</aside>`;
}

function findImageNode(nodes: SlideNode[]): SlideNode | null {
  for (const node of nodes) {
    if (node.type === 'image') {
      return node;
    }
    if (node.children) {
      const img = findImageNode(node.children);
      if (img) return img;
    }
  }
  return null;
}

function removeImageNode(nodes: SlideNode[]): SlideNode[] {
  return nodes
    .map((node) => {
      if (node.type === 'image') {
        return null;
      }
      if (node.children) {
        return {
          ...node,
          children: removeImageNode(node.children),
        };
      }
      return node;
    })
    .filter((n): n is SlideNode => n !== null);
}

export function renderSlide(slide: Slide): string {
  const titleHtml = slide.title ? `<h2 class="slideTitle">${sanitizeHtml(slide.title)}</h2>` : '';
  const notesHtml = renderNotes(slide.notes);

  let contentHtml = '';
  if (slide.type === 'split') {
    const isManualSplit =
      slide.content.length === 2 &&
      slide.content[0].type === 'column' &&
      slide.content[1].type === 'column';
    if (isManualSplit) {
      const leftHtml = nodeToHtml(slide.content[0]);
      const rightHtml = nodeToHtml(slide.content[1]);

      contentHtml = `
      <div class="splitLayout">
        <div class="splitColumn textColumn">
          ${leftHtml}
        </div>
        <div class="splitColumn rightColumn">
          ${rightHtml}
        </div>
      </div>`;
    } else {
      const imageNode = findImageNode(slide.content);
      if (imageNode) {
        const textNodes = removeImageNode(slide.content);
        const textHtml = textNodes.map(nodeToHtml).join('\n');
        const imageHtml = nodeToHtml(imageNode);

        contentHtml = `
        <div class="splitLayout">
          <div class="splitColumn textColumn">
            ${textHtml}
          </div>
          <div class="splitColumn imageColumn">
            ${imageHtml}
          </div>
        </div>`;
      } else {
        contentHtml = slide.content.map(nodeToHtml).join('\n');
      }
    }
  } else {
    contentHtml = slide.content.map(nodeToHtml).join('\n');
  }

  return `<section class="slide" data-type="${slide.type}" data-id="${slide.id}">
  ${titleHtml}
  <div class="slideContent">
    ${contentHtml}
  </div>
  ${notesHtml}
</section>`;
}
