import statesList from '../data/states-list.json';
import coverageData from '../data/leadsmart-plumbing-coverage.json';

export interface StateInfo {
  name: string;
  slug: string;
  abbr: string;
  totalZips?: number;
  uniqueCities?: number;
  maxPayout?: number;
}

export interface CityInfo {
  name: string;
  slug: string;
  stateAbbr: string;
  stateName: string;
  stateSlug: string;
  zips: string[];
  topPayout: number;
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const stateMap = new Map<string, StateInfo>();
const stateByAbbr = new Map<string, StateInfo>();

for (const state of statesList) {
  const cov = coverageData.states.find(s => s.state === state.abbr);
  const info: StateInfo = {
    ...state,
    totalZips: cov?.totalZips || 0,
    uniqueCities: cov?.uniqueCities || 0,
    maxPayout: cov?.maxPayout || 0,
  };
  stateMap.set(state.slug, info);
  stateByAbbr.set(state.abbr, info);
}

// Pre-index cities by state for instant O(1) lookups
const citiesByState = new Map<string, CityInfo[]>();

for (const raw of coverageData.cities) {
  const state = stateByAbbr.get(raw.state);
  if (!state) continue;

  let list = citiesByState.get(raw.state);
  if (!list) {
    list = [];
    citiesByState.set(raw.state, list);
  }

  list.push({
    name: raw.city,
    slug: slugify(raw.city),
    stateAbbr: raw.state,
    stateName: state.name,
    stateSlug: state.slug,
    zips: raw.zips,
    topPayout: raw.top_payout,
  });
}

// Sort each state's cities by topPayout descending once
for (const [_, list] of citiesByState) {
  list.sort((a, b) => b.topPayout - a.topPayout);
}

export function getAllStates(): StateInfo[] {
  return Array.from(stateMap.values());
}

export function getStateBySlug(slug: string): StateInfo | undefined {
  return stateMap.get(slug);
}

export function getCitiesForState(stateAbbr: string): CityInfo[] {
  return citiesByState.get(stateAbbr) || [];
}

export function getTopCitiesForState(stateAbbr: string, limit = 24): CityInfo[] {
  const cities = citiesByState.get(stateAbbr) || [];
  return cities.slice(0, limit);
}

