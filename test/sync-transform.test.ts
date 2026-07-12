import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  odiseeLeerresultaatListSchema,
  odiseeOpoListSchema,
  odiseeProgrammeListSchema,
} from '../schemas/odisee-api.schema';
import {
  deriveOlrCode,
  resolveProgramme,
  stripTrailingNvt,
  toOlrOutcomes,
  toOpoIndex,
} from '../src/sync/transform';

const fixturesDir = resolve(dirname(fileURLToPath(import.meta.url)), 'fixtures/odisee');
function loadFixture(name: string): unknown {
  return JSON.parse(readFileSync(resolve(fixturesDir, name), 'utf8'));
}

const programmes = odiseeProgrammeListSchema.parse(loadFixture('programmes.sample.json'));
const opos = odiseeOpoListSchema.parse(loadFixture('opos.sample.json'));
const leerresultaten = odiseeLeerresultaatListSchema.parse(
  loadFixture('leerresultaten.sample.json'),
);

describe('odisee sync transforms', () => {
  it('strips a trailing " (NVT)" marker only at the end', () => {
    expect(stripTrailingNvt('Doel X (NVT)')).toBe('Doel X');
    expect(stripTrailingNvt('Doel (NVT) in het midden')).toBe('Doel (NVT) in het midden');
    expect(stripTrailingNvt('Doel Y\n')).toBe('Doel Y');
  });

  it('derives OLR codes from volgnummer', () => {
    expect(deriveOlrCode(3)).toBe('LR3');
  });

  it('maps leerresultaten to bilingual, volgnummer-sorted outcomes', () => {
    const out = toOlrOutcomes(leerresultaten);
    expect(out.length).toBe(leerresultaten.length);
    expect(out[0]?.code).toBe('LR1');
    expect((out[0]?.nl ?? '').length).toBeGreaterThan(0);
    const nums = out.map((o) => o.volgnummer);
    expect(nums).toEqual([...nums].sort((a, b) => a - b));
  });

  it('builds an OPO index carrying both code and name', () => {
    const index = toOpoIndex(opos);
    expect(index.length).toBe(opos.length);
    expect(index[0]?.opoCode).toBeTruthy();
    expect(index[0]?.naam).toBeTruthy();
  });

  it('resolves a programme by code, id, or name', () => {
    expect(resolveProgramme(programmes, 'O-SC-HPBGRD').id).toBe(542);
    expect(resolveProgramme(programmes, '542').id).toBe(542);
    expect(resolveProgramme(programmes, 'Graduaat in het programmeren').id).toBe(542);
  });

  it('throws on no match and on ambiguous match', () => {
    expect(() => resolveProgramme(programmes, 'zzzz-does-not-exist')).toThrow(/No programme/);
    expect(() => resolveProgramme(programmes, 'Bachelor in de agro')).toThrow(/Ambiguous/);
  });
});
