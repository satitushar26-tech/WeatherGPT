export interface WeatherStation {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  temperature: number;
  feelsLike: number;
  condition: string;
  icon: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rain' | 'thunderstorm' | 'windy' | 'snow';
  humidity: number;
  windSpeed: number;
  rainChance: number;
}

export interface MapAlertItem {
  id: string;
  type: string;
  severity: string;
  title: string;
  location: string;
  issued: string;
  expires: string;
  description: string;
  color?: string;
  lat?: number;
  lng?: number;
}

// Coordinate lookups for major Indian regions and cities
export const INDIA_COORDINATES: Record<string, [number, number]> = {
  delhi: [28.6139, 77.209],
  'new delhi': [28.6139, 77.209],
  mumbai: [19.076, 72.8777],
  bombay: [19.076, 72.8777],
  bengaluru: [12.9716, 77.5946],
  bangalore: [12.9716, 77.5946],
  kolkata: [22.5726, 88.3639],
  calcutta: [22.5726, 88.3639],
  chennai: [13.0827, 80.2707],
  madras: [13.0827, 80.2707],
  hyderabad: [17.385, 78.4867],
  ahmedabad: [23.0225, 72.5714],
  pune: [18.5204, 73.8567],
  jaipur: [26.9124, 75.7873],
  lucknow: [26.8467, 80.9462],
  bhopal: [23.2599, 77.4126],
  patna: [25.5941, 85.1376],
  chandigarh: [30.7333, 76.7794],
  srinagar: [34.0837, 74.7973],
  leh: [34.1526, 77.5771],
  ladakh: [34.1526, 77.5771],
  shimla: [31.1048, 77.1734],
  dehradun: [30.3165, 78.0322],
  guwahati: [26.1445, 91.7362],
  dibrugarh: [27.4728, 94.912],
  assam: [26.2006, 92.9376],
  odisha: [20.2961, 85.8245],
  'coastal odisha': [19.8135, 85.8312],
  puri: [19.8135, 85.8312],
  bhubaneswar: [20.2961, 85.8245],
  kerala: [9.9312, 76.2673],
  kochi: [9.9312, 76.2673],
  thiruvananthapuram: [8.5241, 76.9366],
  visakhapatnam: [17.6868, 83.2185],
  raipur: [21.2514, 81.6296],
  ranchi: [23.3441, 85.3096],
  gangtok: [27.3389, 88.6065],
  sikkim: [27.3389, 88.6065],
  shillong: [25.5788, 91.8933],
  itnagar: [27.0844, 93.6053],
  imphal: [24.817, 93.9368],
  kohima: [25.6751, 94.1086],
  aizawl: [23.7271, 92.7176],
  agartala: [23.8315, 91.2868],
  'port blair': [11.6234, 92.7265],
  andaman: [11.6234, 92.7265],
  kavaratti: [10.5667, 72.6417],
  lakshadweep: [10.5667, 72.6417],
  surat: [21.1702, 72.8311],
  nagpur: [21.1458, 79.0882],
  indore: [22.7196, 75.8577],
  coimbatore: [11.0168, 76.9558],
  madurai: [9.9252, 78.1198],
  varanasi: [25.3176, 82.9739],
  amritsar: [31.634, 74.8723],
  jodhpur: [26.2389, 73.0243],
  mangalore: [12.9141, 74.856],
  goa: [15.2993, 74.124],
  panaji: [15.4909, 73.8278],
};

const DEFAULT_FALLBACK_POINTS: [number, number][] = [
  [28.6139, 77.209], // Delhi
  [27.4728, 94.912], // Dibrugarh
  [19.8135, 85.8312], // Odisha coast
  [19.076, 72.8777], // Mumbai
  [12.9716, 77.5946], // Bengaluru
  [22.5726, 88.3639], // Kolkata
  [13.0827, 80.2707], // Chennai
  [34.0837, 74.7973], // Srinagar
];

export function resolveCoordinates(locationStr: string, fallbackIndex = 0): [number, number] {
  if (!locationStr) return DEFAULT_FALLBACK_POINTS[fallbackIndex % DEFAULT_FALLBACK_POINTS.length];
  const normalized = locationStr.toLowerCase();
  for (const [key, coords] of Object.entries(INDIA_COORDINATES)) {
    if (normalized.includes(key)) {
      return coords;
    }
  }
  return DEFAULT_FALLBACK_POINTS[fallbackIndex % DEFAULT_FALLBACK_POINTS.length];
}

import { ALL_INDIAN_STATES_WEATHER } from './india-states-weather';

// Weather Stations covering all 28 States and 8 Union Territories across India
export const PAN_INDIA_WEATHER_STATIONS: WeatherStation[] = ALL_INDIAN_STATES_WEATHER.map((s) => ({
  id: `st-${s.id}`,
  name: `${s.capital} (${s.name})`,
  state: s.name,
  lat: s.lat,
  lng: s.lng,
  temperature: s.temperature,
  feelsLike: s.feelsLike,
  condition: s.condition,
  icon: s.icon,
  humidity: s.humidity,
  windSpeed: s.windSpeed,
  rainChance: s.rainChance,
}));

// Map Tile Themes
export interface MapThemeConfig {
  id: string;
  name: string;
  tileUrl: string;
  attribution: string;
  subdomains: string[];
  maxZoom: number;
}

export const MAP_THEMES: Record<string, MapThemeConfig> = {
  voyager: {
    id: 'voyager',
    name: 'Voyager Warm',
    tileUrl: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19,
  },
  light: {
    id: 'light',
    name: 'Clean Light',
    tileUrl: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19,
  },
  dark: {
    id: 'dark',
    name: 'Dark Radar',
    tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 19,
  },
};

// SVG Icon Helpers for Alert Markers
export function getAlertIconSvg(alertType: string): string {
  const type = alertType.toLowerCase();
  if (type.includes('flood') || type.includes('water') || type.includes('river')) {
    // Droplets icon
    return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>`;
  }
  if (type.includes('cyclone') || type.includes('storm') || type.includes('wind') || type.includes('circulation')) {
    // Wind / Swirl icon
    return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`;
  }
  if (type.includes('heat') || type.includes('temperature') || type.includes('warm')) {
    // Sun / Thermometer
    return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg>`;
  }
  if (type.includes('lightning') || type.includes('thunder')) {
    // Zap icon
    return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>`;
  }
  if (type.includes('cold') || type.includes('snow') || type.includes('frost')) {
    // Snowflake icon
    return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/><path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/><path d="m17 21-3-6h-4l-3 6"/><path d="m17 3-3 6h-4L7 3"/><path d="M2 12h20"/></svg>`;
  }
  // Default: Siren / Warning
  return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
}

// SVG Icon Helpers for Weather Station Markers
export function getWeatherConditionSvg(conditionIcon: string): string {
  switch (conditionIcon) {
    case 'sunny':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
    case 'partly-cloudy':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>`;
    case 'cloudy':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`;
    case 'rain':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>`;
    case 'thunderstorm':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973"/><path d="m13 12-3 5h4l-3 5"/></svg>`;
    case 'windy':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>`;
    case 'snow':
      return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/><path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/><path d="m17 21-3-6h-4l-3 6"/><path d="m17 3-3 6h-4L7 3"/><path d="M2 12h20"/></svg>`;
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/></svg>`;
  }
}

export function getSeverityColors(severity: string, customColor?: string): { bg: string; border: string; text: string } {
  const norm = severity.toLowerCase();
  if (customColor === 'rose' || customColor === 'red' || norm.includes('high') || norm.includes('severe') || norm.includes('warning') || norm.includes('watch')) {
    return { bg: '#b94836', border: '#f7d0cb', text: '#ffffff' };
  }
  if (customColor === 'orange' || customColor === 'amber' || norm.includes('moderate') || norm.includes('advisory')) {
    return { bg: '#df7639', border: '#fae3ce', text: '#ffffff' };
  }
  return { bg: '#2f7a6d', border: '#cce6e1', text: '#ffffff' };
}
