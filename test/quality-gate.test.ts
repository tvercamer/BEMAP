import { describe, expect, it } from 'vitest';
import { loadOerConfig, loadQualityGate } from '../src/quality-gate/rules';
import { implementedCheckIds, validateFicheSession } from '../src/quality-gate/validate';
import { loadFicheSession } from './helpers';

const gate = loadQualityGate();
const oer = loadOerConfig();

describe('quality gate', () => {
  it('every check in the ruleset has an automated evaluator', () => {
    for (const check of gate.checks) {
      expect(implementedCheckIds).toContain(check.id);
    }
  });

  it('passes a well-aligned fiche-session', () => {
    const session = loadFicheSession('examples/good/fiche-session.yaml');
    const report = validateFicheSession(session, gate, oer);

    const failures = report.checks.filter((c) => !c.passed);
    expect(
      failures,
      `unexpected failures: ${failures.map((f) => `${f.id} (${f.message})`).join('; ')}`,
    ).toEqual([]);
    expect(report.passedBlocking).toBe(true);
    expect(report.passedAll).toBe(true);
  });

  it('fails the intended checks on a weak fiche-session', () => {
    const session = loadFicheSession('examples/weak/fiche-session.yaml');
    const report = validateFicheSession(session, gate, oer);
    const passedById = Object.fromEntries(report.checks.map((c) => [c.id, c.passed]));

    // Each defect in examples/weak/fiche-session.yaml is designed to trip one check.
    expect(passedById['QG-01']).toBe(false); // LO3 has no assessment coverage
    expect(passedById['QG-02']).toBe(false); // A2 is not in the toetsmatrijs
    expect(passedById['QG-03']).toBe(false); // LO1 uses "understand"
    expect(passedById['QG-04']).toBe(false); // total below the ECTS band
    expect(passedById['QG-05']).toBe(false); // "presentation" form + weights sum to 90
    expect(passedById['QG-06']).toBe(false); // LO2 has no OLR trace

    expect(report.passedBlocking).toBe(false);
  });
});
