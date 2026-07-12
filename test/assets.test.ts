import { describe, expect, it } from 'vitest';
import { ficheSessionSchema } from '../schemas/fiche-session.schema';
import { programmeOlrSchema } from '../schemas/olr.schema';
import { loadOerConfig, loadQualityGate } from '../src/quality-gate/rules';
import { readYaml } from './helpers';

describe('knowledge assets are schema-valid', () => {
  it('quality-gate.yaml parses and has all six checks', () => {
    const gate = loadQualityGate();
    expect(gate.checks).toHaveLength(6);
    const ids = gate.checks.map((c) => c.id);
    expect(ids).toEqual(['QG-01', 'QG-02', 'QG-03', 'QG-04', 'QG-05', 'QG-06']);
  });

  it('oer-evaluation.yaml parses', () => {
    const oer = loadOerConfig();
    expect(oer.permitted_forms.length).toBeGreaterThan(0);
    expect(oer.weight_must_sum_to).toBe(100);
  });

  it('the example programme OLR is valid', () => {
    expect(() =>
      programmeOlrSchema.parse(readYaml('knowledge/programmes/example-programme/olr.yaml')),
    ).not.toThrow();
  });

  it('both example fiche-sessions match the schema', () => {
    for (const path of ['examples/good/fiche-session.yaml', 'examples/weak/fiche-session.yaml']) {
      expect(() => ficheSessionSchema.parse(readYaml(path)), path).not.toThrow();
    }
  });
});
