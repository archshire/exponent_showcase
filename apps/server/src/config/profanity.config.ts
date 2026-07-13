// ---------------------------------------------------------------------------
// Community Chat profanity filter
// ---------------------------------------------------------------------------
//
// Server-side censorship is authoritative: raw offensive content must never be
// broadcast to other clients. The client may pre-censor for local feedback, but
// the server's censored message is the only thing other clients display.
//
// This is an intentionally small, dependency-free word list. It matches
// whole words case-insensitively and tolerates simple letter-repetition and
// common symbol obfuscation (e.g. "f u c k", "sh!t"). Extend as needed.

const BANNED_WORDS = [
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'bastard',
  'dick',
  'piss',
  'cunt',
  'slut',
  'whore',
  'fag',
  'nigger',
  'retard',
];

// Map common leet/symbol substitutions back to letters so obfuscated variants
// are still caught.
const LEET: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '7': 't',
  '@': 'a',
  $: 's',
  '!': 'i',
};

function normalize(token: string): string {
  return (
    token
      .toLowerCase()
      .split('')
      .map((ch) => LEET[ch] ?? ch)
      .join('')
      // collapse repeated letters: "shiiit" -> "shit"
      .replace(/(.)\1{2,}/g, '$1$1')
      .replace(/[^a-z]/g, '')
  );
}

const BANNED_SET = new Set(BANNED_WORDS.map(normalize));

function isBannedToken(token: string): boolean {
  const norm = normalize(token);
  if (norm.length === 0) return false;
  if (BANNED_SET.has(norm)) return true;
  // catch words containing a banned root as a contiguous chunk
  for (const banned of BANNED_SET) {
    if (banned.length >= 4 && norm.includes(banned)) return true;
  }
  return false;
}

/**
 * Replaces offensive tokens with asterisks of the same visible length while
 * preserving the original spacing/punctuation between tokens.
 */
export function censor(text: string): string {
  return text.replace(/\S+/g, (token) => (isBannedToken(token) ? '*'.repeat(token.length) : token));
}
