import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { stringify } from 'yaml';
import type { ProgrammeIndexFile, ProgrammeOlrFile } from '../schemas/programme-sync.schema';
import {
  endpoints,
  fetchOlr,
  fetchOpos,
  fetchProgrammes,
  fetchYears,
} from '../src/sync/odisee-api';
import { resolveProgramme, toOlrOutcomes, toOpoIndex } from '../src/sync/transform';

/**
 * Sync one Odisee programme's OLRs and OPO index into knowledge/programmes/<year>/<code>/.
 * Usage: npm run sync:olr -- --programme <code|name|id> [--year <YYYY>]
 */

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');

const { values } = parseArgs({
  options: {
    programme: { type: 'string' },
    year: { type: 'string' },
  },
});

if (!values.programme) {
  console.error('Usage: npm run sync:olr -- --programme <code|name|id> [--year <YYYY>]');
  process.exit(1);
}

const years = await fetchYears();
const year = values.year ? Number(values.year) : Math.max(...years);
if (!years.includes(year)) {
  console.error(`Academic year ${year} is not available. Available: ${years.join(', ')}`);
  process.exit(1);
}

const programme = resolveProgramme(await fetchProgrammes(year), values.programme);

const [opos, leerresultaten] = await Promise.all([
  fetchOpos(programme.id, year),
  fetchOlr(programme.id, year),
]);

const provenance = {
  institution: 'Odisee',
  academiejaar: year,
  programme: { id: programme.id, code: programme.code, naam: programme.naam },
};
const fetchedAt = new Date().toISOString();

const olrFile: ProgrammeOlrFile = {
  ...provenance,
  source: endpoints.olr(programme.id, year),
  fetched_at: fetchedAt,
  outcomes: toOlrOutcomes(leerresultaten),
};

const indexFile: ProgrammeIndexFile = {
  ...provenance,
  source: endpoints.opos(programme.id, year),
  fetched_at: fetchedAt,
  opos: toOpoIndex(opos),
};

const outDir = resolve(repoRoot, 'knowledge/programmes', String(year), programme.code);
mkdirSync(outDir, { recursive: true });
writeFileSync(resolve(outDir, 'olr.yaml'), stringify(olrFile), 'utf8');
writeFileSync(resolve(outDir, 'programme.yaml'), stringify(indexFile), 'utf8');

console.log(
  `Synced ${programme.code} (${year}): ${olrFile.outcomes.length} OLRs, ${indexFile.opos.length} OPOs -> ${outDir.replace(`${repoRoot}/`, '')}`,
);
