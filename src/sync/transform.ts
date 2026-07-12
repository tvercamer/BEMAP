import type {
  OdiseeLeerresultaat,
  OdiseeOpo,
  OdiseeProgramme,
  OdiseeVertaling,
} from '../../schemas/odisee-api.schema';
import type { BilingualOutcome, OpoIndexEntry } from '../../schemas/programme-sync.schema';

/** Pure mappers from Odisee API shapes to BEMAP's stored shapes. No network here. */

/** Remove a trailing " (NVT)" marker (and trailing whitespace); keep the objective text. */
export function stripTrailingNvt(text: string): string {
  return text.replace(/\s*\(NVT\)\s*$/i, '').trimEnd();
}

/** Text for a language code ("N"/"E"), NVT-stripped; "" when absent. */
export function textForLanguage(vertalingen: OdiseeVertaling[], taal: string): string {
  const match = vertalingen.find((v) => v.taal === taal);
  return match ? stripTrailingNvt(match.tekst) : '';
}

/** Programme OLR code derived from its programme-wide number. */
export function deriveOlrCode(volgnummer: number): string {
  return `LR${volgnummer}`;
}

export function toBilingualOutcome(lr: OdiseeLeerresultaat): BilingualOutcome {
  return {
    code: deriveOlrCode(lr.volgnummer),
    volgnummer: lr.volgnummer,
    nl: textForLanguage(lr.vertalingen, 'N'),
    en: textForLanguage(lr.vertalingen, 'E'),
  };
}

/** Programme OLR set, sorted by volgnummer. */
export function toOlrOutcomes(leerresultaten: OdiseeLeerresultaat[]): BilingualOutcome[] {
  return [...leerresultaten].sort((a, b) => a.volgnummer - b.volgnummer).map(toBilingualOutcome);
}

/** OPO index (for lookup by code or name), sorted by opoCode. */
export function toOpoIndex(opos: OdiseeOpo[]): OpoIndexEntry[] {
  return [...opos]
    .sort((a, b) => a.opoCode.localeCompare(b.opoCode))
    .map((o) => ({ opoCode: o.opoCode, naam: o.naam, id: o.id, fase: o.opleidingsFase }));
}

/**
 * Resolve a programme from a query, matching exact code/id first, then a code/name substring.
 * Throws on no match, and on ambiguity (listing the candidates).
 */
export function resolveProgramme(programmes: OdiseeProgramme[], query: string): OdiseeProgramme {
  const q = query.trim().toLowerCase();
  const exact = programmes.filter((p) => p.code.toLowerCase() === q || String(p.id) === q);
  const matches = exact.length
    ? exact
    : programmes.filter(
        (p) => p.naam.toLowerCase().includes(q) || p.code.toLowerCase().includes(q),
      );

  if (matches.length === 0) {
    throw new Error(`No programme matches "${query}".`);
  }
  if (matches.length > 1) {
    const list = matches
      .slice(0, 10)
      .map((p) => `  ${p.code} — ${p.naam}`)
      .join('\n');
    throw new Error(`Ambiguous programme "${query}". Candidates:\n${list}`);
  }
  const [only] = matches;
  if (!only) throw new Error('unreachable');
  return only;
}
