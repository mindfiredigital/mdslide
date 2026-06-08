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
