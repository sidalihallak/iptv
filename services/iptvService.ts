const BASE_URL = 'https://iptv-org.github.io/api';

export interface Stream {
  channel: string;
  url: string;
  timeshift?: string;
  http_referrer?: string;
  user_agent?: string;
}

export interface Channel {
  id: string;
  name: string;
  alt_names?: string[];
  network?: string;
  owners?: string[];
  country: string;
  subdivision?: string;
  city?: string;
  broadcast_area?: string[];
  languages?: string[];
  categories?: string[];
  is_nsfw: boolean;
  launched?: string;
  closed?: string;
  replaced_by?: string;
  website?: string;
  logo: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface Country {
  code: string;
  name: string;
}

export interface Subdivision {
  code: string;
  name: string;
  country: string;
}

export interface Region {
  code: string;
  name: string;
  countries?: string[];
}

export interface Guide {
  channel: string;
  site: string;
  lang?: string;
  url?: string;
}

const fetchAPI = async <T>(endpoint: string): Promise<T> => {
  const response = await fetch(`${BASE_URL}/${endpoint}`);
  if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
  return response.json();
};

export const fetchStreams = () => fetchAPI<Stream[]>('streams.json');
export const fetchChannels = () => fetchAPI<Channel[]>('channels.json');
export const fetchCategories = () => fetchAPI<Category[]>('categories.json');
export const fetchLanguages = () => fetchAPI<Language[]>('languages.json');
export const fetchCountries = () => fetchAPI<Country[]>('countries.json');
export const fetchSubdivisions = () => fetchAPI<Subdivision[]>('subdivisions.json');
export const fetchRegions = () => fetchAPI<Region[]>('regions.json');
export const fetchGuides = () => fetchAPI<Guide[]>('guides.json');
export const fetchLogos = () => fetchAPI<Guide[]>('logos.json');
