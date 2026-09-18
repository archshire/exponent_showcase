const small: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
};
const tens: Record<string, number> = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };

/** Take the first integer phrase, never join separate guesses into one answer. */
export function firstSpokenNumber(transcript: string): string | null {
  const words = transcript.toLowerCase().replace(/(?<=\w)-(?=\w)/g, ' ').match(/-?\d+(?:\.\d+)?|[a-z]+/g) ?? [];
  for (let i = 0; i < words.length; i++) {
    let negative = false;
    if (words[i] === 'minus' || words[i] === 'negative') { negative = true; i++; }
    const token = words[i];
    if (!token) return null;
    if (/^-?\d/.test(token)) {
      const value = Number(token) * (negative ? -1 : 1);
      return Number.isInteger(value) && Math.abs(value) <= 999999 ? String(value) : null;
    }
    if (small[token] === undefined && tens[token] === undefined) continue;
    let value = small[token] ?? tens[token];
    if (tens[token] !== undefined && small[words[i + 1]] !== undefined && small[words[i + 1]] < 10) value += small[words[++i]];
    if (words[i + 1] === 'hundred') {
      value *= 100; i++;
      if (words[i + 1] === 'and') i++;
      const next = words[i + 1];
      if (tens[next] !== undefined) {
        value += tens[next]; i++;
        if (small[words[i + 1]] !== undefined && small[words[i + 1]] < 10) value += small[words[++i]];
      } else if (small[next] !== undefined) value += small[words[++i]];
    }
    return String(negative ? -value : value);
  }
  return null;
}
