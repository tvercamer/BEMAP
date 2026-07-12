import {
  odiseeLeerresultaatListSchema,
  odiseeOpoListSchema,
  odiseeProgrammeListSchema,
  odiseeYearsSchema,
} from '../../schemas/odisee-api.schema';

/** Typed client for the public Odisee ECTS API. No auth required. */

export const BASE_URL = 'https://ects-invoer.odisee.be';

export const endpoints = {
  years: () => `${BASE_URL}/Opleiding/academiejaren`,
  programmes: (year: number) => `${BASE_URL}/Opleiding?academiejaar=${year}`,
  opos: (opleidingId: number, year: number) =>
    `${BASE_URL}/LeeruitkomstOpo/opo?opleidingId=${opleidingId}&academiejaar=${year}`,
  olr: (opleidingId: number, year: number) =>
    `${BASE_URL}/Leerresultaat?opleidingId=${opleidingId}&academiejaar=${year}`,
};

async function getJson(url: string): Promise<unknown> {
  const response = await fetch(url, { headers: { accept: 'application/json' } });
  if (!response.ok) {
    throw new Error(`GET ${url} -> HTTP ${response.status}`);
  }
  return response.json();
}

export async function fetchYears(): Promise<number[]> {
  return odiseeYearsSchema.parse(await getJson(endpoints.years()));
}

export async function fetchProgrammes(year: number) {
  return odiseeProgrammeListSchema.parse(await getJson(endpoints.programmes(year)));
}

export async function fetchOpos(opleidingId: number, year: number) {
  return odiseeOpoListSchema.parse(await getJson(endpoints.opos(opleidingId, year)));
}

export async function fetchOlr(opleidingId: number, year: number) {
  return odiseeLeerresultaatListSchema.parse(await getJson(endpoints.olr(opleidingId, year)));
}
