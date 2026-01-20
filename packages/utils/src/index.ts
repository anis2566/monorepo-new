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
