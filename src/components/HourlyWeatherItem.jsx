import { weatherCodes } from "../constants";

const HourlyWeatherItem = ({ hourlyWeather }) => {
  // Extract and format temperature and time
  const temperature = Math.floor(hourlyWeather.temp_c);
  let time = hourlyWeather.time.split(" ")[1].substring(0, 5);
  
  // Format time to be more readable (e.g., 1 PM instead of 13:00)
  const formatTime = (timeStr) => {
    const [hours] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}${ampm}`;
  };
  
  // Find the appropriate weather icon
  const weatherIcon = Object.keys(weatherCodes).find((icon) => 
    weatherCodes[icon].includes(hourlyWeather.condition.code)
  );
  
  return (
    <li className="weather-item">
      <p className="time">{formatTime(time)}</p>
      <img 
        src={`icons/${weatherIcon}.svg`} 
        className="weather-icon" 
        alt={hourlyWeather.condition.text}
      />
      <p className="temperature">{temperature}°</p>
      <p className="condition">{hourlyWeather.condition.text}</p>
    </li>
  );
};

export default HourlyWeatherItem;