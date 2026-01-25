export const BANGLA_TO_ENGLISH_MAP: Record<string, string> = {
    "\u0995": "A", // ক
    "\u0996": "B", // খ
    "\u0997": "C", // গ
    "\u0998": "D", // ঘ
    "\u0999": "E", // ঙ
    "\u099A": "F", // চ
    "\u099B": "G", // ছ
    "\u099C": "H", // জ
    "\u099D": "I", // ঝ
    "\u099E": "J", // ঞ
};

export const BANGLA_LABELS = ["\u0995", "\u0996", "\u0997", "\u0998", "\u0999", "\u099A", "\u099B", "\u099C", "\u099D", "\u099E"];

export function normalizeOptionLabel(label: string | null | undefined): string {
    if (!label) return "";

    // Stringify and trim
    const str = String(label).trim();

    // Check map
    if (BANGLA_TO_ENGLISH_MAP[str]) {
        return BANGLA_TO_ENGLISH_MAP[str];
    }

    // Check if it's already an English character A-Z
    if (/^[A-Za-z]$/.test(str)) {
        return str.toUpperCase();
    }

    // Fallback: search for the character in the map values (case-insensitive)
    return str.toUpperCase();
}

/**
 * Finds the correct option letter (A, B, C, D...) based on the literal answer string
 * and the list of available options.
 */
export function getCorrectLetter(answer: string | null | undefined, options: string[] | null | undefined): string {
    if (!answer || !options || options.length === 0) return String(answer || "");

    const trimmedAnswer = String(answer).trim();

    // If answer is already a single English letter, return it normalized
    if (/^[A-Za-z]$/.test(trimmedAnswer)) {
        return normalizeOptionLabel(trimmedAnswer);
    }

    // Check if it's a Bangla single letter
    if (BANGLA_TO_ENGLISH_MAP[trimmedAnswer]) {
        return BANGLA_TO_ENGLISH_MAP[trimmedAnswer];
    }

    // Otherwise, find the index of the answer in the options array
    const index = options.findIndex(opt => opt && opt.trim() === trimmedAnswer);
    if (index !== -1) {
        return String.fromCharCode(65 + index); // 0 -> A, 1 -> B, etc.
    }

    // If no match found, return the answer as is (might be a malformed letter or unexpected string)
    return trimmedAnswer;
}
