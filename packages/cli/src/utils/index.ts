import { STYLES, COLORS } from '../constants/index.js';

export function c(color: string, text: string): string {
  if (!process.stdout.isTTY) return text;
  return `${color}${text}${STYLES.reset}`;
}

export const ICONS = {
  info: c(COLORS.blue, '●'),
  success: c(COLORS.green, '✔'),
  warn: c(COLORS.yellow, '⚠'),
  error: c(COLORS.red, '✖'),
  step: c(COLORS.cyan, '→'),
  dim: c(COLORS.grey, '·'),
};
