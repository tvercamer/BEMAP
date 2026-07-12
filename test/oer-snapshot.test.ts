import { describe, expect, it } from 'vitest';
import { oerSourcesSchema } from '../schemas/oer-sources.schema';
import { buildSnapshot, sha256 } from '../src/sync/oer';
import { readYaml } from './helpers';

describe('oer sources + snapshot', () => {
  it('oer-sources.yaml is valid and lists both OER documents', () => {
    const sources = oerSourcesSchema.parse(readYaml('knowledge/rules/oer-sources.yaml'));
    expect(sources.sources.map((s) => s.id)).toEqual(['general', 'campus-brussel']);
  });

  it('buildSnapshot embeds provenance front matter and the trimmed text', () => {
    const md = buildSnapshot(
      {
        id: 'general',
        label: 'Test OER',
        sourceUrl: 'https://x/media/1',
        resolvedUrl: 'https://x/a.pdf',
        fetchedAt: '2026-07-12T00:00:00.000Z',
        pages: 3,
        sha256: 'abc123',
      },
      '  Hello OER body.  ',
    );
    expect(md.startsWith('---\n')).toBe(true);
    expect(md).toContain('id: oer-general');
    expect(md).toContain('source_url: https://x/media/1');
    expect(md).toContain('pages: 3');
    expect(md).toContain('sha256: abc123');
    expect(md).toContain('# Test OER');
    expect(md).toContain('Hello OER body.');
  });

  it('sha256 is deterministic', () => {
    const bytes = new TextEncoder().encode('pdf-bytes');
    expect(sha256(bytes)).toBe(sha256(bytes));
  });
});
