import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BANGLA_OPTION_LABELS = [
  "ক", // 0
  "খ", // 1
  "গ", // 2
  "ঘ", // 3
  "ঙ", // 4 (rarely used but available)
  "চ", // 5 (rarely used but available)
  "ছ", // 6 (rarely used)
  "জ", // 7 (rarely used)
  "ঝ", // 8 (rarely used)
  "ঞ", // 9 (rarely used)
];

/**
 * Get Bangla option label by index
 * @param index - Option index (0-based)
 * @returns Bangla letter (ক, খ, গ, ঘ, etc.)
 */
export function getBanglaOptionLabel(index: number): string {
  if (index < 0 || index >= BANGLA_OPTION_LABELS.length) {
    // Fallback to English letters if out of range
    return String.fromCharCode(65 + index); // A, B, C, D, ...
  }
  return BANGLA_OPTION_LABELS[index];
}

/**
 * Get index from Bangla option label
 * @param label - Bangla letter (ক, খ, গ, ঘ, etc.)
 * @returns Index (0-based) or -1 if not found
 */
export function getBanglaOptionIndex(label: string): number {
  return BANGLA_OPTION_LABELS.indexOf(label);
}

/**
 * Check if a label is in Bangla format
 * @param label - Option label to check
 * @returns true if Bangla, false if English or other
 */
export function isBanglaOptionLabel(label: string): boolean {
  return BANGLA_OPTION_LABELS.includes(label);
}

/**
 * Convert English label (A, B, C) to Bangla (ক, খ, গ)
 * @param englishLabel - English letter (A, B, C, D, etc.)
 * @returns Bangla letter or original if conversion fails
 */
export function convertEnglishToBangla(englishLabel: string): string {
  const index = englishLabel.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, ...
  return getBanglaOptionLabel(index);
}

/**
 * Convert Bangla label (ক, খ, গ) to English (A, B, C)
 * @param banglaLabel - Bangla letter (ক, খ, গ, ঘ, etc.)
 * @returns English letter or original if conversion fails
 */
export function convertBanglaToEnglish(banglaLabel: string): string {
  const index = getBanglaOptionIndex(banglaLabel);
  if (index === -1) return banglaLabel;
  return String.fromCharCode(65 + index); // 0=A, 1=B, ...
}

/**
 * Normalize option label to Bangla
 * If input is English (A, B, C), convert to Bangla
 * If input is already Bangla, return as-is
 * @param label - Option label (English or Bangla)
 * @returns Bangla label
 */
export function normalizeOptionToBangla(label: string): string {
  // Check if it's English letter (A-Z)
  if (label.length === 1 && /^[A-Z]$/i.test(label)) {
    return convertEnglishToBangla(label);
  }
  // Already Bangla or other format
  return label;
}

/**
 * Normalize option label to English
 * If input is Bangla (ক, খ, গ), convert to English
 * If input is already English, return as-is
 * @param label - Option label (English or Bangla)
 * @returns English label
 */
export function normalizeOptionToEnglish(label: string): string {
  // Check if it's Bangla letter
  if (isBanglaOptionLabel(label)) {
    return convertBanglaToEnglish(label);
  }
  // Already English or other format
  return label;
}
