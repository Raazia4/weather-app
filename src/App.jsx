import SearchSection from "./components/SearchSection";
import CurrentWeather from "./components/CurrentWeather";
import HourlyWeatherItem from "./components/HourlyWeatherItem";
import { weatherCodes } from "./constants";
import { useEffect, useRef, useState } from "react";
import NoResultsDiv from "./components/NoResultsDiv";

const App = () => {
  const [currentWeather, setCurrentWeather] = useState({});
  const [hourlyForecasts, setHourlyForecasts] = useState([]);
  const [hasNoResults, setHasNoResults] = useState(false);
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const searchInputRef = useRef(null);
  const API_KEY = import.meta.env.VITE_API_KEY;

  const filterHourlyForecast = (hourlyData) => {
    const currentHour = new Date().setMinutes(0, 0, 0);
    const next24Hours = currentHour + 24 * 60 * 60 * 1000;
    // Filter the hourly data to only include the next 24 hours
    const next24HoursData = hourlyData.filter(({ time }) => {
      const forecastTime = new Date(time).getTime();
      return forecastTime >= currentHour && forecastTime <= next24Hours;
    });
    setHourlyForecasts(next24HoursData);
  };

  // Fetches weather details based on the API URL
  const getWeatherDetails = async (API_URL) => {
    setHasNoResults(false);
    setIsLoading(true);
    window.innerWidth <= 768 && searchInputRef.current.blur();
    
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error();
        const data = await response.json();
        
        // Extract current weather data
        const temperature = Math.floor(data.current.temp_c);
        const description = data.current.condition.text;
        const weatherIcon = Object.keys(weatherCodes).find((icon) => 
          weatherCodes[icon].includes(data.current.condition.code)
        );
        
        setCurrentWeather({ temperature, description, weatherIcon });
        setLocation(data.location.name);
        
        // Combine hourly data from both forecast days
        const combinedHourlyData = [...data.forecast.forecastday[0].hour, ...data.forecast.forecastday[1].hour];
        searchInputRef.current.value = data.location.name;
        filterHourlyForecast(combinedHourlyData);
        setIsLoading(false);
        resolve();
      } catch (error) {
        // Set setHasNoResults state if there's an error
        setHasNoResults(true);
        setIsLoading(false);
        console.error("Error fetching weather data:", error);
        reject(error);
      }
    });
  };

  // Fetch default city (London) weather data on initial render
  useEffect(() => {
    const defaultCity = "London";
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${defaultCity}&days=2`;
    getWeatherDetails(API_URL);
  }, []);

  return (
    <div className="container">
      {/* App Title */}
      <div className="app-header">
        <h1>Weather Forecast</h1>
        {location && <p className="location-name">{location}</p>}
      </div>
      
      {/* Search section */}
      <SearchSection getWeatherDetails={getWeatherDetails} searchInputRef={searchInputRef} />
      
      {/* Loading state */}
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      ) : hasNoResults ? (
        <NoResultsDiv />
      ) : (
        <div className="weather-section">
          {/* Current weather */}
          <CurrentWeather currentWeather={currentWeather} />
          
          {/* Hourly weather forecast list */}
          <div className="hourly-forecast">
            <h3>24-Hour Forecast</h3>
            <ul className="weather-list">
              {hourlyForecasts.map((hourlyWeather) => (
                <HourlyWeatherItem key={hourlyWeather.time_epoch} hourlyWeather={hourlyWeather} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;