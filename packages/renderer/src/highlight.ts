import { codeToHtml } from 'shiki';

// maps mdslide theme names to matching shiki themes
const SHIKI_THEME_MAP: Record<string, string> = {
  light: 'github-light',
  dark: 'github-dark',
  notion: 'github-light',
  terminal: 'terminal-ansi',
  gradient: 'one-dark-pro',
};

// highlights a code string for a given language and mdslide theme
export async function highlightCode(
  code: string,
  lang: string = '',
  theme: string = 'light'
): Promise<string> {
  if (!code.trim()) return `<pre><code></code></pre>`;

  const shikiTheme = SHIKI_THEME_MAP[theme] ?? 'github-light';

  try {
    return await codeToHtml(code, {
      lang: lang || 'text',
      theme: shikiTheme,
    });
  } catch {
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
