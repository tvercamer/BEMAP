import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Assembles the portable knowledge/ assets into a single Claude Project instruction file.
 *
 * The output (project/project-instructions.md) is a GENERATED artifact: paste it into a
 * Claude Project as the custom instructions. Never hand-edit it — edit the knowledge assets
 * and re-run `npm run build:project`. CI verifies it is up to date (drift check).
 *
 * Ordering is deterministic so the drift check is stable.
 */

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const OUTPUT = 'project/project-instructions.md';

function read(relativePath: string): string {
  return readFileSync(resolve(repoRoot, relativePath), 'utf8');
}

/** Remove leading YAML front matter; it is asset metadata, noise in the assembled prose. */
function stripFrontMatter(md: string): string {
  const match = md.match(/^---\n[\s\S]*?\n---\n/);
  return (match ? md.slice(match[0].length) : md).replace(/^\s+/, '');
}

const stageFiles = readdirSync(resolve(repoRoot, 'knowledge/stages'))
  .filter((f) => f.endsWith('.md'))
  .sort()
  .map((f) => `knowledge/stages/${f}`);

type Section = { path: string; kind: 'md' | 'yaml' };

// Assembly order: methodology → persona → stages → references → rules → template.
const manifest: Section[] = [
  { path: 'knowledge/methodology/backward-design.md', kind: 'md' },
  { path: 'knowledge/persona/coach.md', kind: 'md' },
  ...stageFiles.map((path): Section => ({ path, kind: 'md' })),
  { path: 'knowledge/reference/dublin-descriptors.md', kind: 'md' },
  { path: 'knowledge/reference/bloom-verbs.en.md', kind: 'md' },
  { path: 'knowledge/reference/bloom-verbs.nl.md', kind: 'md' },
  { path: 'knowledge/rules/quality-gate.yaml', kind: 'yaml' },
  { path: 'knowledge/rules/oer-evaluation.md', kind: 'md' },
  { path: 'knowledge/templates/ects-fiche.yaml', kind: 'yaml' },
];

function renderSection(section: Section): string {
  const provenance = `<!-- source: ${section.path} -->`;
  if (section.kind === 'yaml') {
    return `${provenance}\n\n## Structured asset: ${basename(section.path)}\n\n\`\`\`yaml\n${read(section.path).trimEnd()}\n\`\`\``;
  }
  return `${provenance}\n\n${stripFrontMatter(read(section.path)).trimEnd()}`;
}

const header = `<!--
  GENERATED FILE — DO NOT EDIT BY HAND.
  Built from knowledge/ by scripts/build-project-instructions.ts.
  Run \`npm run build:project\` after changing any knowledge asset.
-->

# BEMAP — Course Design Coach (Project Instructions)

You are BEMAP (Backwards Educational Mapping And Planning), an AI course-design coach for
Flemish higher education. Follow the methodology, persona, stages, references, and rules
below to guide a professor through designing one OPO and producing a compliant ECTS-fiche,
using Backward Design and the constructive-alignment quality gate.
`;

const body = manifest.map(renderSection).join('\n\n---\n\n');
const output = `${header}\n${body}\n`;

const outputPath = resolve(repoRoot, OUTPUT);
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, output, 'utf8');
console.log(`Wrote ${OUTPUT} from ${manifest.length} knowledge assets.`);
