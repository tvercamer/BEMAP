import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { oerSourcesSchema } from '../schemas/oer-sources.schema';
import { buildSnapshot, extractPdfText, fetchPdf, sha256 } from '../src/sync/oer';

/**
 * Fetch the configured OER PDFs and snapshot each as a provenance-stamped Markdown file in
 * knowledge/rules/oer-snapshots/. The coach reads these; they are generated, not hand-edited.
 * Usage: npm run sync:oer
 */

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');

const sources = oerSourcesSchema.parse(
  parse(readFileSync(resolve(repoRoot, 'knowledge/rules/oer-sources.yaml'), 'utf8')),
);

const outDir = resolve(repoRoot, 'knowledge/rules/oer-snapshots');
mkdirSync(outDir, { recursive: true });

for (const source of sources.sources) {
  process.stdout.write(`Fetching ${source.id} … `);
  const { resolvedUrl, bytes } = await fetchPdf(source.url);
  // Hash and measure BEFORE extraction: pdf.js detaches the underlying buffer.
  const digest = sha256(bytes);
  const sizeMb = bytes.length / 1024 / 1024;
  const { text, pages } = await extractPdfText(bytes);
  const snapshot = buildSnapshot(
    {
      id: source.id,
      label: source.label,
      sourceUrl: source.url,
      resolvedUrl,
      fetchedAt: new Date().toISOString(),
      pages,
      sha256: digest,
    },
    text,
  );
  writeFileSync(resolve(outDir, `${source.id}.md`), snapshot, 'utf8');
  console.log(`${pages} pages, ${sizeMb.toFixed(1)} MB → oer-snapshots/${source.id}.md`);
}
