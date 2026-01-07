// hooks/use-mcq-shuffle-simple.ts
// ALTERNATIVE: Simpler approach using crypto for seeded random

import { useMemo } from "react";

/**
 * Simple hash function to convert string to number
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Seeded random using simple Linear Congruential Generator
 * More reliable than complex implementations
 */
function createSeededRandom(seed: string) {
  let state = hashString(seed);

  return function () {
    // Linear congruential generator
    state = (state * 1664525 + 1013904223) | 0;
    return Math.abs(state) / 2147483648; // Normalize to 0-1
  };
}

/**
 * Simple, reliable shuffle with seeded random
 */
function shuffleArray<T>(array: T[], seed: string): T[] {
  const result = [...array];
  const random = createSeededRandom(seed);

  // Fisher-Yates shuffle
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));

    // Simple array swap
    [result[i], result[j]] = [result[j]!, result[i]!];
  }

  return result;
}

/**
 * Convert letter to index (A=0, B=1, C=2, D=3)
 */
function letterToIndex(letter: string): number {
  return letter.toUpperCase().charCodeAt(0) - 65;
}

/**
 * Convert index to letter (0=A, 1=B, 2=C, 3=D)
 */
function indexToLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

/**
 * Check if answer is in letter format
 */
function isLetterFormat(answer: string): boolean {
  if (!answer) return false;
  const letter = answer.trim().toUpperCase();
  return letter.length === 1 && /^[A-Z]$/.test(letter);
}

/**
 * Get answer index from options
 */
function getAnswerIndex(options: string[], answer: string): number {
  if (isLetterFormat(answer)) {
    return letterToIndex(answer);
  }

  // Find by text match
  const index = options.findIndex((opt) => opt?.trim() === answer?.trim());

  return index >= 0 ? index : 0; // Fallback to 0 if not found
}

/**
 * Type for shuffled MCQ
 */
export type ShuffledMcq<T> = T & {
  correctAnswerLetter: string;
};

/**
 * Shuffle multiple MCQs - Simple and reliable
 */
export function useShuffledMcqs<
  T extends {
    id: string;
    options: string[];
    answer: string;
  },
>(questions: T[], studentId: string, shouldShuffle: boolean): ShuffledMcq<T>[] {
  return useMemo(() => {
    if (!questions || !Array.isArray(questions)) {
      return [];
    }

    return questions.map((question) => {
      // Validate question
      if (!question || !question.options || !Array.isArray(question.options)) {
        console.error("Invalid question:", question);
        return {
          ...question,
          correctAnswerLetter: "A",
        } as ShuffledMcq<T>;
      }

      try {
        // Get original correct answer index
        const originalIndex = getAnswerIndex(question.options, question.answer);

        // No shuffle - just add correctAnswerLetter
        if (!shouldShuffle) {
          return {
            ...question,
            correctAnswerLetter: indexToLetter(originalIndex),
          } as ShuffledMcq<T>;
        }

        // Shuffle the options
        const seed = `${studentId}-${question.id}`;
        const shuffledOptions = shuffleArray(question.options, seed);

        // Find where the correct answer moved to
        const correctAnswerText = question.options[originalIndex];
        const newIndex = shuffledOptions.findIndex(
          (opt) => opt === correctAnswerText
        );

        if (newIndex === -1) {
          console.error("Could not find correct answer after shuffle");
          return {
            ...question,
            correctAnswerLetter: indexToLetter(originalIndex),
          } as ShuffledMcq<T>;
        }

        return {
          ...question,
          options: shuffledOptions,
          correctAnswerLetter: indexToLetter(newIndex),
        } as ShuffledMcq<T>;
      } catch (error) {
        console.error("Error in shuffle:", error);
        return {
          ...question,
          correctAnswerLetter: "A",
        } as ShuffledMcq<T>;
      }
    });
  }, [questions, studentId, shouldShuffle]);
}

/**
 * Shuffle single MCQ
 */
export function useShuffledMcq<
  T extends {
    options: string[];
    answer: string;
    id: string;
  },
>(mcq: T, studentId: string, shouldShuffle: boolean): ShuffledMcq<T> {
  const result = useShuffledMcqs([mcq], studentId, shouldShuffle);
  return result[0] ?? ({ ...mcq, correctAnswerLetter: "A" } as ShuffledMcq<T>);
}
