import type { SlideNode, Slide } from '@mindfiredigital/mdslide-shared';

// Factory function to create slide node
export function createSlideNode(partial: Partial<SlideNode> & { type: string }): SlideNode {
  return {
    type: partial.type,
    value: partial.value,
    children: partial.children,
    lang: partial.lang,
    ordered: partial.ordered,
    url: partial.url,
    alt: partial.alt,
    header: partial.header,
  };
}
