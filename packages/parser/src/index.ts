import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import type { Root } from 'mdast';

export type ParsedAST = Root & {
  clean(): ParsedAST;
};

export function stripPositions(node: any): any {
  if (!node || typeof node !== 'object') {
    return node;
  }

  if (Array.isArray(node)) {
    return node.map(stripPositions);
  }

  const { position, ...rest } = node;
  const cleaned: any = {};
  for (const key in rest) {
    if (Object.prototype.hasOwnProperty.call(rest, key)) {
      cleaned[key] = stripPositions(rest[key]);
    }
  }

  if (node.type === 'root') {
    Object.defineProperty(cleaned, 'clean', {
      value: function () {
        return this;
      },
      enumerable: false,
      writable: true,
      configurable: true,
    });
  }

  return cleaned;
}

export function parseMarkdownToAST(markdown: string, options?: { clean?: boolean }): ParsedAST {
  const root = unified().use(remarkParse).use(remarkGfm).use(remarkMath).parse(markdown) as Root;

  // Define clean method on standard Root
  Object.defineProperty(root, 'clean', {
    value: function () {
      return stripPositions(this);
    },
    enumerable: false,
    writable: true,
    configurable: true,
  });

  const parsed = root as ParsedAST;

  if (options?.clean) {
    return stripPositions(parsed) as ParsedAST;
  }

  return parsed;
}

export interface ParserInterface {
  (markdown: string, options?: { clean?: boolean }): ParsedAST;
  (): {
    parse(markdown: string, options?: { clean?: boolean }): ParsedAST;
    clean(markdown: string): ParsedAST;
    strip(ast: Root): Root;
  };
  clean(markdown: string): ParsedAST;
  strip(ast: Root): Root;
}

const parser: ParserInterface = function (markdown?: string, options?: { clean?: boolean }): any {
  if (typeof markdown === 'string') {
    return parseMarkdownToAST(markdown, options);
  }

  return {
    parse(md: string, opts?: { clean?: boolean }) {
      return parseMarkdownToAST(md, opts);
    },
    clean(md: string) {
      return parseMarkdownToAST(md, { clean: true });
    },
    strip(ast: Root) {
      return stripPositions(ast);
    },
  };
} as any;

parser.clean = function (markdown: string) {
  return parseMarkdownToAST(markdown, { clean: true });
};

parser.strip = function (ast: Root) {
  return stripPositions(ast);
};

export default parser;
