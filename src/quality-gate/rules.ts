import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { type OerConfig, oerConfigSchema } from '../../schemas/oer.schema';
import { type QualityGate, qualityGateSchema } from '../../schemas/quality-gate.schema';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../..');

function readYaml(relativePath: string): unknown {
  return parse(readFileSync(resolve(repoRoot, relativePath), 'utf8'));
}

/** Load and validate the quality-gate ruleset (source of truth for checks + severities). */
export function loadQualityGate(): QualityGate {
  return qualityGateSchema.parse(readYaml('knowledge/rules/quality-gate.yaml'));
}

/** Load and validate the machine-checkable OER config used by QG-05. */
export function loadOerConfig(): OerConfig {
  return oerConfigSchema.parse(readYaml('knowledge/rules/oer-evaluation.yaml'));
}
