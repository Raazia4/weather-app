const CurrentWeather = ({ currentWeather }) => {
  // Get current date and time
  const currentDate = new Date();
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const formattedDate = currentDate.toLocaleDateString('en-US', options);
  
  return (
    <div className="current-weather">
      <div className="date-time">
        <p>{formattedDate}</p>
      </div>
      
      <img 
        src={`icons/${currentWeather.weatherIcon}.svg`} 
        className="weather-icon" 
        alt={currentWeather.description}
      />
      
      <h2 className="temperature">
        {currentWeather.temperature}<span>°C</span>
      </h2>
      
      <p className="description">{currentWeather.description}</p>
    </div>
  );
};

export default CurrentWeather;