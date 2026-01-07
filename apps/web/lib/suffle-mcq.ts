/**
 * Fisher-Yates shuffle algorithm
 * Creates a new shuffled array without modifying the original
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }
  return shuffled;
}

/**
 * Create a consistent shuffle order based on a seed
 * This ensures the same shuffle for the same seed (useful for review)
 */
export function seededShuffle<T>(array: T[], seed: string): T[] {
  const shuffled = [...array];

  // Simple hash function for seed
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash = hash & hash;
  }

  // Seeded random function
  const random = () => {
    hash = (hash * 9301 + 49297) % 233280;
    return hash / 233280;
  };

  // Fisher-Yates with seeded random
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j]!, shuffled[i]!];
  }

  return shuffled;
}

/**
 * Shuffle MCQ options while preserving the correct answer mapping
 * Returns both shuffled options and the new correct answer position
 */
export function shuffleMcqOptions(options: string[], correctAnswer: string) {
  // Find original answer index
  const originalIndex = options.indexOf(correctAnswer);

  if (originalIndex === -1) {
    throw new Error("Correct answer not found in options");
  }

  // Create array of option objects with original indices
  const optionsWithIndices = options.map((option, index) => ({
    option,
    originalIndex: index,
    isCorrect: index === originalIndex,
  }));

  // Shuffle
  const shuffled = shuffleArray(optionsWithIndices);

  // Extract shuffled options and find new correct answer
  const shuffledOptions = shuffled.map((item) => item.option);
  const newCorrectAnswer =
    shuffledOptions[shuffled.findIndex((item) => item.isCorrect)]!;

  return {
    options: shuffledOptions,
    correctAnswer: newCorrectAnswer,
  };
}

/**
 * Shuffle with seed for consistent results
 */
export function shuffleMcqOptionsSeeded(
  options: string[],
  correctAnswer: string,
  seed: string
) {
  const originalIndex = options.indexOf(correctAnswer);

  if (originalIndex === -1) {
    throw new Error("Correct answer not found in options");
  }

  const optionsWithIndices = options.map((option, index) => ({
    option,
    originalIndex: index,
    isCorrect: index === originalIndex,
  }));

  const shuffled = seededShuffle(optionsWithIndices, seed);

  const shuffledOptions = shuffled.map((item) => item.option);
  const newCorrectAnswer =
    shuffledOptions[shuffled.findIndex((item) => item.isCorrect)]!;

  return {
    options: shuffledOptions,
    correctAnswer: newCorrectAnswer,
  };
}

/**
 * Convert answer from letter to index-based position
 */
export function letterToIndex(letter: string): number {
  return letter.toUpperCase().charCodeAt(0) - 65; // A=0, B=1, C=2, D=3
}

/**
 * Convert index to letter
 */
export function indexToLetter(index: number): string {
  return String.fromCharCode(65 + index); // 0=A, 1=B, 2=C, 3=D
}

/**
 * Shuffle MCQ with letter-based answers (A, B, C, D)
 * Updates the answer letter to match the new position
 */
export function shuffleMcqWithLetterAnswer(
  options: string[],
  answerLetter: string,
  seed?: string
): {
  options: string[];
  answer: string;
} {
  // Convert letter to index
  const originalIndex = letterToIndex(answerLetter);

  if (originalIndex < 0 || originalIndex >= options.length) {
    throw new Error("Invalid answer letter");
  }

  // Create indexed array
  const optionsWithIndices = options.map((option, index) => ({
    option,
    isCorrect: index === originalIndex,
  }));

  // Shuffle (with or without seed)
  const shuffled = seed
    ? seededShuffle(optionsWithIndices, seed)
    : shuffleArray(optionsWithIndices);

  // Find new position of correct answer
  const newCorrectIndex = shuffled.findIndex((item) => item.isCorrect);
  const newAnswerLetter = indexToLetter(newCorrectIndex);

  return {
    options: shuffled.map((item) => item.option),
    answer: newAnswerLetter,
  };
}
