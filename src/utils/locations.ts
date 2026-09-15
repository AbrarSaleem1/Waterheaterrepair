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

export function getAllStates(): StateInfo[] {
  return Array.from(stateMap.values());
}

export function getStateBySlug(slug: string): StateInfo | undefined {
  return stateMap.get(slug);
}

export function getCitiesForState(stateAbbr: string): CityInfo[] {
  const state = stateByAbbr.get(stateAbbr);
  if (!state) return [];

  const rawCities = coverageData.cities.filter(c => c.state === stateAbbr);
  
  return rawCities.map(c => ({
    name: c.city,
    slug: slugify(c.city),
    stateAbbr: c.state,
    stateName: state.name,
    stateSlug: state.slug,
    zips: c.zips,
    topPayout: c.top_payout,
  }));
}

export function getTopCitiesForState(stateAbbr: string, limit = 24): CityInfo[] {
  const cities = getCitiesForState(stateAbbr);
  return cities
    .sort((a, b) => b.topPayout - a.topPayout)
    .slice(0, limit);
}
