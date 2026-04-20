import type { Root, RootContent } from 'mdast';
import type { Slide, SlideNode } from '@mindfiredigital/mdslide-shared';

// converts the mdast content to a plane slidenode
function toNode(node: RootContent): SlideNode {
  return {
    type: node.type,
    value: 'value' in node ? String(node.value) : undefined,
    children:
      'children' in node ? node.children.map((child: RootContent) => toNode(child)) : undefined,
  };
}

export function splitSlides(tree: Root): Slide[] {
  const slides: Slide[] = [];

  // Start the first slide
  let current: Slide = {
    id: globalThis.crypto.randomUUID(),
    type: 'content',
    content: [],
  };

  for (const node of tree.children) {
    //For thematic break '***' stop present slide go to new one
    if (node.type === 'thematicBreak') {
      slides.push(current);
      current = {
        id: globalThis.crypto.randomUUID(),
        type: 'content',
        content: [],
      };
      continue;
    }

    if (node.type === 'heading') {
      // Pull the raw text out of first child
      const text =
        node.children.length > 0 && 'value' in node.children[0]
          ? String(node.children[0].value)
          : '';

      // for ## H2
      if (node.depth === 2) {
        slides.push(current);
        current = {
          id: globalThis.crypto.randomUUID(),
          type: 'content',
          title: text,
          content: [],
        };
        continue;
      }

      // for # H1
      if (node.depth === 1) {
        current.title = text;
        continue;
      }
    }

    current.content.push(toNode(node));
  }
  slides.push(current);

  return slides;
}
