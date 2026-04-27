function countSyllables(word: string): number {
  const original = word.replace(/[^a-zA-Z]/g, "");
  if (!original) return 0;

  // Acronyms/abbreviations (all-caps, ≤6 letters): each letter is one syllable
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
  score: number;          // SMOG grade level
  age: number;            // estimated reading age (grade + 5)
  avgSentenceLength: number;
  polysyllableCount: number;
}

export function calcFlesch(text: string): FleschResult {
  // Strip footnote asterisks before processing
  const normalized = text.replace(/\*+/g, " ");

  // Split on . or ! followed by whitespace/end; ? only at line-end or end-of-string
  // to avoid false breaks on brand names like "Which?"
  const sentences = normalized
    .split(/[.!]+(?=\s|$)|[?]+(?=\n|$)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const words = normalized.split(/\s+/).filter((w) => w.replace(/[^a-zA-Z]/g, "").length > 0);

  if (sentences.length === 0 || words.length === 0) {
    return { score: 0, age: 0, avgSentenceLength: 0, polysyllableCount: 0 };
  }

  // SMOG: count every word with 3+ syllables
  const polysyllableCount = words.filter((w) => countSyllables(w) >= 3).length;
  const avgSentenceLen = words.length / sentences.length;

  // SMOG Grade = 3 + √(polysyllables × 30/sentences)
  // Scale to 30-sentence baseline for texts shorter than 30 sentences
  const adjustedPoly = polysyllableCount * (30 / Math.min(sentences.length, 30));
  const smogGrade = 3 + Math.sqrt(adjustedPoly);
  const age = Math.max(5, Math.round(smogGrade + 5));

  return {
    score: Math.round(smogGrade * 10) / 10,
    age,
    avgSentenceLength: Math.round(avgSentenceLen * 10) / 10,
    polysyllableCount,
  };
}
