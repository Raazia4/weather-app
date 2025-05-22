import { useState } from "react";

const SearchSection = ({ getWeatherDetails, searchInputRef }) => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [isSearching, setIsSearching] = useState(false);
  
  // Handles city search form submission
  const handleCitySearch = (e) => {
    e.preventDefault();
    const input = e.target.querySelector(".search-input");
    if (!input.value.trim()) return;
    
    setIsSearching(true);
    const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${input.value}&days=2`;
    
    // Fetches weather details for the entered city
    getWeatherDetails(API_URL).finally(() => {
      setIsSearching(false);
    });
  };
  
  // Gets user's current location (latitude/longitude)
  const handleLocationSearch = () => {
    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const API_URL = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=2`;
        
        // Fetches weather data for user's current location
        getWeatherDetails(API_URL).finally(() => {
          setIsSearching(false);
          window.innerWidth >= 768 && searchInputRef.current.focus();
        });
      },
      (error) => {
        setIsSearching(false);
        alert("Location access denied. Please enable permissions to use this feature.");
        console.error("Geolocation error:", error);
      }
    );
  };
  
  return (
    <div className="search-section">
      <form action="#" className="search-form" onSubmit={handleCitySearch}>
        <span className="material-symbols-rounded">
          {isSearching ? "pending" : "search"}
        </span>
        <input 
          type="search" 
          placeholder="Enter a city name" 
          className="search-input" 
          ref={searchInputRef} 
          required 
        />
        <button type="submit" className="search-button">
          <span className="material-symbols-rounded">arrow_forward</span>
        </button>
      </form>
      <button 
        className={`location-button ${isSearching ? "loading" : ""}`} 
        onClick={handleLocationSearch}
        disabled={isSearching}
      >
        <span className="material-symbols-rounded">my_location</span>
      </button>
    </div>
  );
};

export default SearchSection;