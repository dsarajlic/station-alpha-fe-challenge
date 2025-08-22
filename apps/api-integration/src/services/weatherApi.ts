const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEOCODE_URL = 'https://api.openweathermap.org/geo/1.0/direct';
// WeatherAPI.com supports alerts on free tier, unable to fetch from OpenWeatherMap (via OneCall API)
const WEATHER_URL = 'https://api.weatherapi.com/';



// Couple with WeatherData object
export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_dir: string;
    humidity: number;
    feelslike_c: number;
    feelslike_f: number;
    uv: number;
  };
  forecast?: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
        daily_chance_of_rain: number;
      };
    }>;
  };
  alerts?: {
    alert: Array<{
      headline: string;
      severity: string;
      urgency: string;
      areas: string;
      desc: string;
      effective: string;
      expires: string;
    }>;
  };
}

// Helper function to parse location into lat/long which is expected by APIs
// Could have been done with regex, but this is more readable / easier to understand
const parseLocation = (location: string): { isCoordinates: boolean; lat?: number; lon?: number } => {
  const parts = location.trim().split(',');

  if (parts.length === 2) {
    const lat = parseFloat(parts[0]);
    const lon = parseFloat(parts[1]);

    // Check if both parts are valid numbers
    if (!isNaN(lat) && !isNaN(lon)) {
      return { isCoordinates: true, lat, lon };
    }
  }

  return { isCoordinates: false };
};

export const testWeatherAPIAlerts = async (location: string) => {
  try {
    const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}&alerts=yes`;
    console.log('Testing WeatherAPI URL:', url);

    const response = await fetch(url);
    console.log('Response status:', response.status);

    const data = await response.json();
    console.log('WeatherAPI data:', data);
    console.log('Alerts in response:', data.alerts);

    return data;
  } catch (error) {
    console.error('Test error:', error);
    return null;
  }
};

/**
 * Get current weather data for a location
 * @param location - City name, zip code, or coordinates
 * @returns Promise with weather data
 */
export const getCurrentWeather = async (location: string): Promise<WeatherData> => {

  const cacheKey = `weather_${location}`;

  const checkCache = getCachedWeatherData(cacheKey);
  if (checkCache) return checkCache;

  try {
    const parsedLocation = parseLocation(location);

    const url = parsedLocation.isCoordinates
      ? `${BASE_URL}/weather?lat=${parsedLocation.lat}&lon=${parsedLocation.lon}&APPID=${API_KEY}&units=metric`
      : `${BASE_URL}/weather?q=${location}&APPID=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather data not found: ${response.status}`);
    }

    const data = await response.json();
    const transformedData = transformWeatherData(data);
    cacheWeatherData(cacheKey, transformedData);

    return transformedData;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

/**
 * Get forecast weather data for a location
 * @param location - City name, zip code, or coordinates
 * @param days - Number of days for forecast (1-10)
 * @returns Promise with weather forecast data
 */

// Days are unavailable for free tier, it seems
export const getWeatherForecast = async (location: string, days: number = 5): Promise<WeatherData> => {
  const cacheKey = `forecast_${location}`;
  const cached = getCachedWeatherData(cacheKey);
  if (cached) return cached;

  try {
    const parsedLocation = parseLocation(location);

    const url = parsedLocation.isCoordinates
      ? `${BASE_URL}/forecast?lat=${parsedLocation.lat}&lon=${parsedLocation.lon}&APPID=${API_KEY}&units=metric`
      : `${BASE_URL}/forecast?q=${location}&APPID=${API_KEY}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather forecast not found: ${response.status}`);
    }

    const data = await response.json();
    const transformedData = transformWeatherData(data);

    // Cache the forecast data
    cacheWeatherData(cacheKey, transformedData, 60); // Cache for 60 minutes

    return transformedData;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};

/**
 * Get weather alerts for a location
 * @param location - City name, zip code, or coordinates
 * @returns Promise with weather alerts data
 */
export const getWeatherAlerts = async (location: string): Promise<WeatherData> => {
  const cacheKey = `alerts_${location}`;
  const cached = getCachedWeatherData(cacheKey);
  if (cached) return cached;

  try {
    const url = `${WEATHER_URL}v1/forecast.json?key=${WEATHER_API_KEY}&q=${location}&alerts=yes`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather alerts not found: ${response.status}`);
    }

    const data = await response.json();
    const transformedData = transformWeatherData(data);

    cacheWeatherData(cacheKey, transformedData);
    console.log('data', data)
    return transformedData;
  } catch (error) {
    console.error('Error fetching weather alerts:', error);
    throw error;
  }
};

/**
 * Search for locations (autocomplete)
 * @param query - Partial location name
 * @returns Promise with location suggestions
 */
export const searchLocations = async (query: string): Promise<any[]> => {
  try {
    const response = await fetch(`${GEOCODE_URL}?q=${query}&limit=5&appid=${API_KEY}`);
    if (!response.ok) throw new Error('Location search failed');

    const data = await response.json();

    return data;

  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
};

/**
 * Transform raw API data to our application's data structure
 * @param data - Raw data from API
 * @returns Transformed WeatherData object
 */
const transformWeatherData = (data: any): WeatherData => {
  const isForecast = !!data.list;
  const current = isForecast ? data.list[0] : data;
  const location = isForecast ? data.city : data;

  return {
    location: {
      name: location.name || 'Unknown',
      country: location.sys?.country || 'Unknown',
      lat: location.coord?.lat || 0,
      lon: location.coord?.lon || 0
    },
    current: {
      temp_c: current.main?.temp || 0,
      temp_f: current.main?.temp * 9 / 5 + 32 || 0,
      condition: {
        text: current.weather?.[0]?.description || 'Unknown',
        icon: `https://openweathermap.org/img/w/${current.weather?.[0]?.icon}.png`,
        code: current.weather?.[0]?.id || 0
      },
      wind_kph: current.wind?.speed * 3.6 || 0,
      wind_dir: current.wind?.deg || 'N',
      humidity: current.main?.humidity || 0,
      feelslike_c: Math.round(current.main?.feels_like || 0),
      feelslike_f: Math.round((current.main?.feels_like || 0) * 9 / 5 + 32),
      uv: 0 // Doesnt seem to exist on current weather data
    },
    forecast: isForecast ? {
      // This would be quite th task to type well, will omit for the moment
      forecastday: data.list.slice(0, 5).map((item: any) => ({
        date: new Date(item.dt * 1000).toISOString().split('T')[0],
        day: {
          maxtemp_c: Math.round(item.main.temp_max),
          mintemp_c: Math.round(item.main.temp_min),
          condition: {
            text: item.weather[0].description,
            icon: `https://openweathermap.org/img/w/${item.weather[0].icon}.png`
          },
          daily_chance_of_rain: Math.round((item.pop || 0) * 100)
        }
      }))
    } : undefined,
    alerts: data.alerts?.alert && data.alerts.alert.length > 0 ? {
      alert: data.alerts.alert.map((alert: any) => ({
        headline: alert.headline,
        severity: alert.severity,
        urgency: alert.urgency,
        areas: alert.areas,
        desc: alert.desc,
        effective: alert.effective,
        expires: alert.expires
      }))
    } : undefined
  };
};

/**
 * Get map URL for a location
 * @param lat - Latitude
 * @param lon - Longitude
 * @param zoom - Zoom level (1-18)
 * @param type - Map type (e.g., 'precipitation', 'temp', 'wind')
 * @returns Map URL string
 */
export const getWeatherMapUrl = (lat: number, lon: number, zoom: number = 10, type: string = 'precipitation'): string => {
  const tileX = Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
  const tileY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));

  // This is the closest thing I can produce to a tile for the moment. 
  // https://tile.openweathermap.org/map doesn't seem to work on free tier.
  return `https://tile.openstreetmap.org/${zoom}/${tileX}/${tileY}.png`;
};

/**
 * Cache weather data in localStorage
 * @param key - Cache key
 * @param data - Data to cache
 * @param expirationMinutes - Cache expiration in minutes
 */
export const cacheWeatherData = (key: string, data: any, expirationMinutes: number = 30): void => {
  const now = new Date();
  const item = {
    data,
    expiry: now.getTime() + expirationMinutes * 60 * 1000,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

/**
 * Get cached weather data from localStorage
 * @param key - Cache key
 * @returns Cached data or null if expired/not found
 */
export const getCachedWeatherData = (key: string): any | null => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  const item = JSON.parse(itemStr);
  const now = new Date();

  if (now.getTime() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }

  return item.data;
}; 