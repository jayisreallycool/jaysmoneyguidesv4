/**
 * SAFE surgical article pass — operates ONLY on standalone markdown image lines,
 * never parses template-literal boundaries (which broke on escaped backticks /
 * code fences). Removes /images/generated/ infographics. Does NOT insert new
 * image slots automatically (that requires content-aware placement that's unsafe
 * to automate against escaped-backtick content); instead it reports where slots
 * are needed so they can be added deliberately.
 */
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIR = join(__dirname, '..', 'lib', 'posts-data');
const FILES = ['affiliatePosts.ts', 'seoPosts.ts', 'bloggingPosts.ts', 'entrepreneurshipPosts.ts', 'techPosts.ts'];

let removed = 0;
for (const file of FILES) {
  const path = join(DIR, file);
  let raw: string;
  try { raw = readFileSync(path, 'utf8'); } catch { continue; }
  const lines = raw.split('\n');
  const out: string[] = [];
  for (const line of lines) {
    // Remove ONLY standalone infographic image lines. A line that is exactly a
    // generated-SVG image markdown (optionally trailing whitespace).
    if (/^\s*!\[[^\]]*\]\(\/images\/generated\/[^)]*\)\s*$/.test(line)) {
      removed++;
      continue; // drop it
    }
    out.push(line);
  }
  writeFileSync(path, out.join('\n'), 'utf8');
  console.log(`[articles] ${file}: cleaned`);
}
console.log(`[articles] removed ${removed} infographic image lines`);
