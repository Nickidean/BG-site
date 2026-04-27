function countSyllables(word: string): number {
  const original = word.replace(/[^a-zA-Z]/g, "");
  if (!original) return 0;

  // Acronyms/abbreviations (all-caps, ≤6 letters): each letter is one syllable
  // e.g. EV → 2, CTA → 3, kWh is mixed-case so falls through to normal logic
  if (original.length <= 6 && original === original.toUpperCase()) {
    return original.length;
  }

  const w = original.toLowerCase();
  if (w.length <= 3) return 1;

  const cleaned = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const matches = cleaned.match(/[aeiouy]{1,2}/g);
  return Math.max(1, matches ? matches.length : 1);
}

export interface FleschResult {
  score: number;
  age: number;
  avgSentenceLength: number;
}

export function calcFlesch(text: string): FleschResult {
  // Strip footnote asterisks before processing so "£185.*" doesn't corrupt sentence detection
  const normalized = text.replace(/\*+/g, " ");

  // Only split on . ! ? when followed by whitespace or end-of-string.
  // This prevents false splits on decimal points (6.75, 3.3) and similar patterns.
  const sentences = normalized
    .split(/[.!?]+(?=\s|$)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const words = normalized.split(/\s+/).filter((w) => w.replace(/[^a-zA-Z]/g, "").length > 0);

  if (sentences.length === 0 || words.length === 0) {
    return { score: 0, age: 0, avgSentenceLength: 0 };
  }

  const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const avgSentenceLen = words.length / sentences.length;
  const avgSyllablesPerWord = syllableCount / words.length;

  // Flesch Reading Ease
  const score = Math.max(
    0,
    Math.min(100, 206.835 - 1.015 * avgSentenceLen - 84.6 * avgSyllablesPerWord)
  );

  // Flesch-Kincaid Grade Level → approximate reading age (grade + 5)
  const gradeLevel = 0.39 * avgSentenceLen + 11.8 * avgSyllablesPerWord - 15.59;
  const age = Math.max(5, Math.round(gradeLevel + 5));

  return {
    score: Math.round(score * 10) / 10,
    age,
    avgSentenceLength: Math.round(avgSentenceLen * 10) / 10,
  };
}
