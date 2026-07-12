import { createHash } from 'node:crypto';
import { extractText, getDocumentProxy } from 'unpdf';

/** Fetch + extract helpers for OER PDF snapshots. Pure formatting is isolated for testing. */

export interface PdfDownload {
  resolvedUrl: string;
  bytes: Uint8Array;
}

export async function fetchPdf(url: string): Promise<PdfDownload> {
  const response = await fetch(url, { redirect: 'follow' });
  if (!response.ok) throw new Error(`GET ${url} -> HTTP ${response.status}`);
  const bytes = new Uint8Array(await response.arrayBuffer());
  return { resolvedUrl: response.url, bytes };
}

export async function extractPdfText(bytes: Uint8Array): Promise<{ text: string; pages: number }> {
  const pdf = await getDocumentProxy(bytes);
  const { totalPages, text } = await extractText(pdf, { mergePages: true });
  return { text, pages: totalPages };
}

export function sha256(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

export interface SnapshotMeta {
  id: string;
  label: string;
  sourceUrl: string;
  resolvedUrl: string;
  fetchedAt: string;
  pages: number;
  sha256: string;
}

/** Build a provenance-stamped Markdown snapshot from extracted PDF text. Pure. */
export function buildSnapshot(meta: SnapshotMeta, text: string): string {
  const frontMatter = [
    '---',
    `id: oer-${meta.id}`,
    `label: ${JSON.stringify(meta.label)}`,
    'status: snapshot',
    `source_url: ${meta.sourceUrl}`,
    `resolved_url: ${meta.resolvedUrl}`,
    `fetched_at: ${meta.fetchedAt}`,
    `pages: ${meta.pages}`,
    `sha256: ${meta.sha256}`,
    '---',
  ].join('\n');

  return [
    frontMatter,
    '',
    "<!-- GENERATED OER snapshot — do not hand-edit; run 'npm run sync:oer'. -->",
    '',
    `# ${meta.label}`,
    '',
    text.trim(),
    '',
  ].join('\n');
}
