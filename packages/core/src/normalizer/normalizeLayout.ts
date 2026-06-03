import { RootContent } from 'mdast';
import { extractTextFromNode } from '../ast/extractTextFromNode.js';
import { VALID_SLIDE_TYPES } from '../constants/index.js';

// Detects manual layout override comments e.g., <!-- layout: dark --> and clear out
export function parseLayoutOveride(nodes: RootContent[]): {
  layoutOverride: string | undefined;
  filteredNodes: RootContent[];
} {
  let layoutOverride: string | undefined;
  const filteredNodes: RootContent[] = [];

  for (const node of nodes) {
    if (node.type == 'html') {
      const val = node.value.trim();
      const layoutMatch = val.match(/^<!--\s*layout:\s*(\w+)\s*-->$/);
      if (layoutMatch) {
        layoutOverride = layoutMatch[1];
        continue;
      }
    }
    filteredNodes.push(node);
  }
  return {
    layoutOverride,
    filteredNodes,
  };
}
