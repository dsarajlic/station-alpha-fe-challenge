import { useState } from 'react'
import './App.css'
import CurrentWeather from './components/CurrentWeather';
import Forecast from './components/Forecast';
import WeatherAlerts from './components/WeatherAlerts';
import WeatherMap from './components/WeatherMap';
import SearchBar from './components/SearchBar';
import {
  WeatherData,
  getCurrentWeather,
  getWeatherForecast,
  getWeatherAlerts,
} from './services/weatherApi';

// Type for search history
export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  const handleSearch = async (location: string) => {
    if (location.trim() === "") return;

    setIsLoading(true);
    setError(null);

    try {
      // Get both current weather and forecast
      const [currentData, forecastData, alertsData] = await Promise.all([
        getCurrentWeather(location),
        getWeatherForecast(location),
        getWeatherAlerts(location)
      ]);

      const combinedData = {
        ...currentData,
        forecast: forecastData.forecast,
        alerts: alertsData.alerts
      };

      setWeatherData(combinedData);

      const newHistoryItem: SearchHistoryItem = {
        query: location,
        timestamp: Date.now()
      };

      setSearchHistory([...searchHistory, newHistoryItem]);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = async (lat: number, lon: number, locationName?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Use coordinates for API call
      const location = `${lat},${lon}`;
      const data = await getCurrentWeather(location);
      setWeatherData(data);

      // Use the actual location name from the API response, not coordinates
      const displayName = data.location.name && data.location.country
        ? `${data.location.name}, ${data.location.country}`
        : locationName || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;

      const newHistoryItem: SearchHistoryItem = {
        query: displayName, // Use readable name instead of coordinates
        timestamp: Date.now()
      };

      setSearchHistory([newHistoryItem, ...searchHistory.slice(0, 9)]);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };


  const addToSearchHistory = (query: string) => {
    const newHistoryItem: SearchHistoryItem = {
      query,
      timestamp: Date.now()
    };

    // Avoid duplicates and keep only the last 10 searches
    const filteredHistory = searchHistory.filter(item => item.query !== query);
    setSearchHistory([newHistoryItem, ...filteredHistory.slice(0, 9)]);
  };

  return (
    <div className="weather-app">
      <header className="app-header">
        <h1>Weather Dashboard</h1>
        <p className="app-description">
          Get real-time weather information for any location
        </p>
      </header>

      <main className="app-content">
        <section className="instructions">
          <h2>API Integration Challenge</h2>
          <p>
            Welcome to the Weather Dashboard API Integration Challenge! Your task is to implement
            a weather application that integrates with a public weather API.
          </p>
          <div className="task-list">
            <h3>Your Tasks:</h3>
            <ol>
              <li>
                <strong>Current Weather Display</strong>
                <p>Implement a search function and display current weather conditions for the searched location.</p>
              </li>
              <li>
                <strong>Search Functionality</strong>
                <p>Add autocomplete/suggestions for city search and remember recent searches.</p>
              </li>
              <li>
                <strong>Extended Forecast</strong>
                <p>Show a 5-day forecast with temperature and conditions.</p>
              </li>
              <li>
                <strong>Weather Map</strong>
                <p>Implement a visual map showing weather patterns and allow users to select locations from the map.</p>
              </li>
              <li>
                <strong>Weather Alerts</strong>
                <p>Display any weather alerts or warnings for the selected location.</p>
              </li>
            </ol>
          </div>
          <div className="api-info">
            <h3>Recommended APIs:</h3>
            <ul>
              <li><a href="https://www.weatherapi.com/" target="_blank" rel="noopener noreferrer">WeatherAPI.com</a></li>
              <li><a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a></li>
              <li><a href="https://www.visualcrossing.com/weather-api" target="_blank" rel="noopener noreferrer">Visual Crossing Weather</a></li>
            </ul>
          </div>
        </section>

        <section className="implementation-area">
          <h2>Your Implementation</h2>

          {/* Search Component Placeholder */}
          <div className="search-container">
            <SearchBar
              onSearch={handleSearch}
              searchHistory={searchHistory}
              addToSearchHistory={addToSearchHistory}
            />
          </div>

          {/* Weather Display Placeholders */}
          <div className="weather-display">
            {isLoading && <div className="loading">Loading weather data...</div>}

            {error && <div className="error-message">{error}</div>}

            {!isLoading && !error && !weatherData && (
              <div className="no-data">
                Search for a location to see weather information
              </div>
            )}

            {weatherData && (
              <div className="weather-content">
                <div className="current-weather">
                  <CurrentWeather weatherData={weatherData} />
                </div>
                <div className="forecast">
                  <Forecast weatherData={weatherData} />
                </div>
                <div className="weather-map">
                  <WeatherMap weatherData={weatherData} onLocationSelect={handleLocationSelect} />
                </div>
                <div className="weather-alerts">
                  <WeatherAlerts weatherData={weatherData} />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>
          API Integration Challenge | Created for Station Alpha Frontend Developer Interviews
        </p>
      </footer>
    </div>
  );
}

export default App;
