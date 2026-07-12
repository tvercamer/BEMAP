import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { type FicheSession, ficheSessionSchema } from '../schemas/fiche-session.schema';

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function readYaml(relativePath: string): unknown {
  return parse(readFileSync(resolve(repoRoot, relativePath), 'utf8'));
}

export function loadFicheSession(relativePath: string): FicheSession {
  return ficheSessionSchema.parse(readYaml(relativePath));
}
