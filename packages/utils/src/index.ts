import {
  BookMarked,
  BookOpen,
  Calculator,
  Cpu,
  Dna,
  FlaskConical,
  Languages,
  LucideIcon,
  Zap,
} from "lucide-react";

const year = new Date().getFullYear();

export const sessions = [
  `${year - 1}-${year}`,
  `${year}-${year + 1}`,
  `${year + 1}-${year + 2}`,
];

export const nationalities = ["Bangladeshi", "Other"];

const banglaDigitMap: Record<string, string> = {
  "0": "০",
  "1": "১",
  "2": "২",
  "3": "৩",
  "4": "৪",
  "5": "৫",
  "6": "৬",
  "7": "৭",
  "8": "৮",
  "9": "৯",
};

function toBanglaNumber(value: number | string): string {
  return value.toString().replace(/\d/g, (d) => banglaDigitMap[d] || d);
}

export function monthsToDuration(months: number): string {
  if (months < 12) {
    return `${toBanglaNumber(months)} মাসের`;
  }

  const years = months / 12;
  const formattedYears = Number.isInteger(years)
    ? years.toString()
    : years.toFixed(1);

  return `${toBanglaNumber(formattedYears)} বছরের`;
}

const subjectIconMap: Record<string, { icon: LucideIcon; color: string }> = {
  জীববিজ্ঞান: { icon: Dna, color: "bg-green-500" },
  রসায়ন: { icon: FlaskConical, color: "bg-orange-500" },
  পদার্থবিজ্ঞান: { icon: Zap, color: "bg-blue-500" },
  "উচ্চতর গণিত": { icon: Calculator, color: "bg-purple-500" },
  গণিত: { icon: Calculator, color: "bg-purple-500" }, // Added fallback
  আইসিটি: { icon: Cpu, color: "bg-yellow-500" },
  বাংলা: { icon: Languages, color: "bg-pink-500" },
  ইংরেজি: { icon: BookOpen, color: "bg-red-500" },
};

// Normalize Unicode and remove extra spaces
const normalizeText = (text: string): string => {
  if (!text) return "";

  return text
    .trim()
    .normalize("NFC") // Normalize Unicode to composed form
    .replace(/\s+/g, " "); // Replace multiple spaces with single space
};

// Get character codes for debugging
const getCharCodes = (text: string): string => {
  return Array.from(text)
    .map((char) => `${char}(${char.charCodeAt(0)})`)
    .join(" ");
};

// Match subject with better fallback
const matchSubject = (
  subjectName: string,
): { icon: LucideIcon; color: string } | null => {
  const normalized = normalizeText(subjectName);

  console.log("🔍 Matching subject:", normalized);

  // Try exact match first
  if (subjectIconMap[normalized]) {
    console.log("✅ Exact match found");
    return subjectIconMap[normalized];
  }

  // Try first word match
  const firstWord = normalized.split(" ")[0] || "";
  console.log("🔍 First word:", firstWord);
  console.log("🔍 First word char codes:", getCharCodes(firstWord));

  if (firstWord && subjectIconMap[firstWord]) {
    console.log("✅ First word match found");
    return subjectIconMap[firstWord];
  }

  // Try checking map keys
  console.log("🔍 Checking all map keys:");
  for (const [key, value] of Object.entries(subjectIconMap)) {
    console.log(`  Key: "${key}" | Char codes: ${getCharCodes(key)}`);

    // Try normalized comparison
    const normalizedKey = normalizeText(key);
    if (normalized.includes(normalizedKey)) {
      console.log(`✅ Contains match found with key: "${key}"`);
      return value;
    }

    // Try case-insensitive and accent-insensitive comparison
    if (
      normalized.toLowerCase().includes(key.toLowerCase()) ||
      firstWord?.toLowerCase() === key.toLowerCase()
    ) {
      console.log(`✅ Case-insensitive match found with key: "${key}"`);
      return value;
    }
  }

  console.log("❌ No match found");
  return null;
};

export const getSubjectIcon = (subjectName: string): LucideIcon => {
  const match = matchSubject(subjectName);
  return match?.icon || BookMarked;
};

export const getSubjectBgColor = (subjectName: string): string => {
  const match = matchSubject(subjectName);
  return match?.color || "bg-gray-500";
};

export const getSubjectTextColor = (subjectName: string): string => {
  const match = matchSubject(subjectName);
  const bgColor = match?.color || "bg-gray-500";
  return bgColor.replace("bg-", "text-");
};

export const getSubjectRingColor = (subjectName: string): string => {
  const match = matchSubject(subjectName);
  const bgColor = match?.color || "bg-gray-500";
  return bgColor.replace("bg-", "ring-");
};

// Export for debugging
export const debugSubject = (subjectName: string) => {
  console.log("========================================");
  console.log("📊 Subject Name Debug");
  console.log("========================================");
  console.log("Raw input:", JSON.stringify(subjectName));
  console.log("Length:", subjectName?.length);
  console.log("Char codes:", getCharCodes(subjectName));
  console.log("Normalized:", normalizeText(subjectName));
  console.log("First word:", normalizeText(subjectName).split(" ")[0]);
  console.log(
    "First word codes:",
    getCharCodes(normalizeText(subjectName)?.split(" ")[0] || ""),
  );
  console.log("----------------------------------------");
  console.log("Map key 'রসায়ন' codes:", getCharCodes("রসায়ন"));
  console.log("========================================");
  const match = matchSubject(subjectName);
  console.log("Match result:", match);
  console.log("========================================");
  return match;
};
