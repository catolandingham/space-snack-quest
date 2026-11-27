/**
 * Long lines in two (or more) bubbles (Brian, 2026-11-26, escape video 0:13: "split any bubble longer than about 12
 * words into two"). The words are never changed (REVIEW-RULES 12: "If it doesn't fit, split it across bubbles; never
 * rewrite it"): a line is cut only where a sentence ends, or, inside a sentence still too long, after a comma.
 */
// ("about 12": a line of 13 words stays whole rather than leave one or two words alone in a bubble)
export const BUBBLE_WORDS = 13;
const wordCount = (s) => s.split(/\s+/).filter(Boolean).length;
/** The pieces of `text`, in order, each at most `max` words where the line's own sentences and commas allow. */
export function splitLine(text, max = BUBBLE_WORDS) {
  if (wordCount(text) <= max) return [text];
  const sentences = (text.match(/[^.?!]+[.?!]+["')]*\s*|[^.?!]+$/g) || [text]).map((s) => s.trim()).filter(Boolean);
  // a line that needs splitting: one sentence to a bubble, except that a question keeps the sentence after it (they
  // read as one thought: "Remember that place on Mars? Let's go find out about it.")
  const out = [];
  for (const s of sentences) {
    const last = out[out.length - 1];
    if (last && /\?["')]*$/.test(last) && wordCount(last + " " + s) <= max) out[out.length - 1] = last + " " + s;
    else if (wordCount(s) <= max) out.push(s);
    else {
      // one sentence too long by itself: after its commas
      let cur = "";
      for (const part of s.split(/(?<=,)\s+/)) {
        if (cur && wordCount(cur + " " + part) > max) (out.push(cur), (cur = part));
        else cur = cur ? cur + " " + part : part;
      }
      cur && out.push(cur);
    }
  }
  return out;
}
