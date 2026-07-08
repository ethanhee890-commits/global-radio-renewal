import { FALLBACK_STATIONS } from '../data/youtubeAlternates.seed';
import type { RadioStation, SearchStationsParams } from '../types/station';
import { compareStationsByQuality } from './qualityScore';

const RADIO_BROWSER_ENDPOINTS = [
  'https://de1.api.radio-browser.info',
  'https://de2.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
  'https://all.api.radio-browser.info'
];

const REQUEST_TIMEOUT_MS = 6000;

type RadioBrowserStation = Partial<RadioStation> & Record<string, unknown>;

function normalizeStation(item: RadioBrowserStation): RadioStation | null {
  const stationuuid = String(item.stationuuid ?? '').trim();
  const name = String(item.name ?? '').trim();
  const url = String(item.url ?? item.url_resolved ?? '').trim();

  if (!stationuuid || !name || !url) {
    return null;
  }

  return {
    stationuuid,
    name,
    url,
    url_resolved: typeof item.url_resolved === 'string' ? item.url_resolved : url,
    homepage: typeof item.homepage === 'string' ? item.homepage : undefined,
    favicon: typeof item.favicon === 'string' ? item.favicon : undefined,
    tags: typeof item.tags === 'string' ? item.tags : undefined,
    country: typeof item.country === 'string' ? item.country : undefined,
    countrycode: typeof item.countrycode === 'string' ? item.countrycode : undefined,
    language: typeof item.language === 'string' ? item.language : undefined,
    codec: typeof item.codec === 'string' ? item.codec : undefined,
    bitrate: Number(item.bitrate ?? 0),
    hls: item.hls === 1 ? 1 : 0,
    lastcheckok: item.lastcheckok === 1 ? 1 : 0,
    ssl_error: item.ssl_error === 1 ? 1 : 0,
    votes: Number(item.votes ?? 0),
    clickcount: Number(item.clickcount ?? 0),
    source: 'radio-browser'
  };
}

function matchesFallback(station: RadioStation, params: SearchStationsParams): boolean {
  const query = params.query?.trim().toLowerCase();
  const country = params.country?.trim().toLowerCase();
  const language = params.language?.trim().toLowerCase();
  const tag = params.tag?.trim().toLowerCase();
  const searchable = [station.name, station.country, station.countrycode, station.language, station.tags].join(' ').toLowerCase();

  return (
    (!query || searchable.includes(query)) &&
    (!country || String(station.country ?? '').toLowerCase().includes(country) || String(station.countrycode ?? '').toLowerCase() === country) &&
    (!language || String(station.language ?? '').toLowerCase().includes(language)) &&
    (!tag || String(station.tags ?? '').toLowerCase().includes(tag))
  );
}

function buildSearchUrl(baseUrl: string, params: SearchStationsParams): string {
  const query = new URLSearchParams({
    hidebroken: 'false',
    limit: String(params.limit ?? 60),
    order: 'votes',
    reverse: 'true'
  });

  if (params.query?.trim()) {
    query.set('name', params.query.trim());
  }
  if (params.country?.trim()) {
    query.set('country', params.country.trim());
  }
  if (params.language?.trim()) {
    query.set('language', params.language.trim());
  }
  if (params.tag?.trim()) {
    query.set('tag', params.tag.trim());
  }

  return `${baseUrl}/json/stations/search?${query.toString()}`;
}

export function getFallbackStations(params: SearchStationsParams = {}): RadioStation[] {
  const filtered = FALLBACK_STATIONS.filter((station) => matchesFallback(station, params));
  const hasSearchScope = Boolean(params.query?.trim() || params.country?.trim() || params.language?.trim() || params.tag?.trim());

  if (filtered.length > 0) {
    return filtered.sort(compareStationsByQuality);
  }

  return hasSearchScope ? [] : FALLBACK_STATIONS.slice().sort(compareStationsByQuality);
}

export async function searchStations(params: SearchStationsParams = {}): Promise<RadioStation[]> {
  const errors: unknown[] = [];

  for (const endpoint of RADIO_BROWSER_ENDPOINTS) {
    const controller = new AbortController();
    const timeout = globalThis.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(buildSearchUrl(endpoint, params), {
        headers: {
          Accept: 'application/json'
        },
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`Radio Browser request failed: ${response.status}`);
      }

      const payload = (await response.json()) as RadioBrowserStation[];
      const stations = payload
        .map(normalizeStation)
        .filter((station): station is RadioStation => Boolean(station))
        .sort(compareStationsByQuality);

      const fallbackMatches = getFallbackStations(params);
      const stationIds = new Set(stations.map((station) => station.stationuuid));
      const mergedStations = [...stations, ...fallbackMatches.filter((station) => !stationIds.has(station.stationuuid))];

      return mergedStations.length > 0 ? mergedStations.sort(compareStationsByQuality) : getFallbackStations(params);
    } catch (error) {
      errors.push(error);
    } finally {
      globalThis.clearTimeout(timeout);
    }
  }

  console.warn('Radio Browser API unavailable. Falling back to seed stations.', errors);
  return getFallbackStations(params);
}
