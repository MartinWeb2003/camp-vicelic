// Refreshes the park4night review score shown on the home and About pages, at
// deploy time rather than in the browser.
//
// Why not client-side: the site is static on GitHub Pages, park4night has no
// public API, and CORS blocks reading their page from a visitor's browser.
// Doing it here costs nothing at runtime and leaves the Consent Mode setup
// alone — no third-party request fires before the visitor has answered the
// banner.
//
// Google is deliberately NOT handled here. Its numbers are hand-maintained
// literals in index.html; see the reviewSources comment there for why.
//
// The numbers live in index.html as marked literals:
//     rating:'5,0'/*P4N_RATING*/, count:'11'/*P4N_COUNT*/
// Each marker is replaced in place. The committed values are the fallback: if
// the lookup fails this script warns and leaves them untouched, so a deploy can
// never blank the tile or ship a rating nobody checked.
//
// Exit code is always 0 unless index.html itself is malformed (a missing
// marker is a real error — it means someone edited the config and the numbers
// silently stopped updating).

import { readFile, writeFile } from 'node:fs/promises';

const FILE = 'index.html';
const UA = 'Mozilla/5.0 (compatible; camping-lovisteparadise-deploy/1.0)';

const warn = (m) => console.log(`::warning::${m}`);
const fail = (m) => { console.log(`::error::${m}`); process.exit(1); };

/** "4.9" | 4.9 -> "4,9" — one decimal, comma separator, as the site displays it. */
const fmtRating = (n) => Number(n).toFixed(1).replace('.', ',');

/**
 * Replaces the string literal that sits immediately before a marker comment.
 * Anchoring on the comment (not on the surrounding object) means reordering or
 * restyling the config cannot make this silently target the wrong field.
 */
function substitute(html, marker, value) {
  const re = new RegExp(`'[^']*'(\\s*/\\*${marker}\\*/)`);
  if (!re.test(html)) fail(`marker ${marker} not found in ${FILE} — the review config was edited without updating this script`);
  return html.replace(re, `'${String(value).replace(/'/g, '')}'$1`);
}

/** park4night: no API, so read the public place page the site already links to. */
async function park4night(placeUrl) {
  const res = await fetch(placeUrl, { headers: { 'user-agent': UA, 'accept-language': 'en' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  // Primary: the summary line, e.g.
  //   <strong>Average (11 Feedback) : </strong><span class="text-gray">5/5</span>
  const avg = html.match(/place-feedback-average[\s\S]{0,200}?\((\d+)\s+Feedback\)[\s\S]{0,120}?>\s*([\d.,]+)\s*\/\s*5\s*</i);
  if (avg) return { count: Number(avg[1]), rating: Number(avg[2].replace(',', '.')) };

  // Fallback: derive both from the individual review nodes, which are far less
  // likely to be restyled at the same time as the summary line.
  const stars = [...html.matchAll(/data-review-rating="(\d(?:[.,]\d)?)"/g)].map((m) => Number(m[1].replace(',', '.')));
  if (stars.length) {
    warn('park4night: summary line not found, averaged the individual reviews instead — their markup probably changed');
    return { count: stars.length, rating: stars.reduce((a, b) => a + b, 0) / stars.length };
  }
  throw new Error('could not find a rating on the page');
}

// ── run ──────────────────────────────────────────────────────────────────────
let html = await readFile(FILE, 'utf8');

// One source of truth for the listing url: whatever the page itself links to.
const p4nUrl = html.match(/url:'(https:\/\/park4night\.com\/[^']+)'/)?.[1];
if (!p4nUrl) fail(`no park4night url found in ${FILE}`);

try {
  const { rating, count } = await park4night(p4nUrl);
  html = substitute(html, 'P4N_RATING', fmtRating(rating));
  html = substitute(html, 'P4N_COUNT', count);
  console.log(`park4night: ${fmtRating(rating)} from ${count} reviews.`);
} catch (e) {
  warn(`park4night lookup failed (${e.message}) — keeping the committed numbers.`);
}

await writeFile(FILE, html);
console.log('park4night numbers updated in index.html (not committed — this is deploy-time only).');
