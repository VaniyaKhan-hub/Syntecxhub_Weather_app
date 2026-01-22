import axios from 'axios';
import {
  Droplet,
  GlassWater,
  Sun,
  Wind,
  CloudRain,
  Search,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';


const popularCities = [

  "Agra", "Ahmedabad", "Allahabad", "Amritsar", "Argentina",
  "Austria", "Auckland", "Bangkok", "Barcelona", "Belgium",
  "Berlin", "Bengaluru", "Bhopal", "Brisbane", "Brazil",
  "Budapest", "Cairo", "Chandigarh", "Chennai", "Chicago",
  "Chile", "China", "Coimbatore", "Colombia", "Croatia",
  "Cuba", "Dehradun", "Delhi", "Denmark", "Dubai",
  "Dublin", "Egypt", "Faridabad", "France", "Germany",
  "Greece", "Guwahati", "Gwalior", "Helsinki", "Hyderabad",
  "Indore", "Indonesia", "Ireland", "Istanbul", "Italy",
  "Jaipur", "Jamshedpur", "Japan", "Jodhpur", "Kanpur",
  "Kenya", "Kolkata", "Lisbon", "London", "Los Angeles",
  "Lucknow", "Ludhiana", "Madurai", "Malaysia", "Mangalore",
  "Madrid", "Melbourne", "Meerut", "Mexico", "Moscow",
  "Mumbai", "Mysuru", "Nagpur", "Nashik", "Netherlands",
  "New York", "Nigeria", "Noida", "Norway", "Paris",
  "Patna", "Peru", "Philippines", "Portugal", "Prague",
  "Pune","Pakistan", "Raipur", "Rajkot", "Ranchi", "Rome",
  "Russia", "Saudi Arabia", "Scotland", "Seoul", "Shimla",
  "Singapore", "Slovakia", "Slovenia", "South Africa",
  "South Korea", "Spain", "Surat", "Sweden", "Switzerland",
  "Sydney", "Thailand", "Thiruvananthapuram", "Tokyo",
  "Toronto", "Turkey", "UAE", "Udaipur",
  "Vancouver", "Varanasi", "Venezuela", "Vienna",
  "Vietnam", "Visakhapatnam", "Warsaw", "Wales",
  "Vienna", "Zürich"
];

const App = () => {
  const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setCity(value);

    if (value.length > 0) {
      const matches = popularCities.filter((c) =>
        c.toLowerCase().startsWith(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const getWeatherData = async (cityName = city) => {
    const selectedCity = popularCities.find(
      (c) => c.toLowerCase() === cityName.toLowerCase()
    );
    if (!selectedCity) {
      alert('Please select a valid city from suggestions.');
      return;
    }

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${apiKey}`
      );
      setWeatherData(response.data);
      console.log(response.data)
      setCity('');
      setSuggestions([]);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion);
    getWeatherData(suggestion);
  };

  // Icon selector based on weather
  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return <Sun size={80} strokeWidth={1.5} />;
      case "Clouds":
        return <CloudRain size={80} strokeWidth={1.5} />;
      case "Rain":
      case "Drizzle":
        return <CloudRain size={80} strokeWidth={1.5} />;
      case "Snow":
        return <CloudRain className="rotate-45" size={80} strokeWidth={1.5} />;
      case "Thunderstorm":
        return <CloudRain className="animate-pulse" size={80} strokeWidth={1.5} />;
      case "Mist":
      case "Fog":
        return <Wind size={80} strokeWidth={1.5} />;
      default:
        return <CloudRain size={80} strokeWidth={1.5} />;
    }
  };

  useEffect(() => {
    getWeatherData("Mumbai");
  }, []);

  return (
    <div className="relative flex justify-center items-center px-4 min-h-screen bg-weather-gradient">
      <div className="max-w-5xl w-full shadow-2xl p-8 bg-weather-gradient backdrop-blur-sm rounded-2xl space-y-6 border border-white/20">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative">
          <h1 className="font-bold text-4xl text-white tracking-wide">GlobeWeather</h1>
          <div className="w-full md:w-auto relative">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                placeholder="Enter a city"
                value={city}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    getWeatherData();
                  }
                }}
                className="px-4 py-2 w-full bg-white/20 placeholder-white text-white border border-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <button className="p-3" onClick={() => getWeatherData()}>
                <Search size={28} className="text-white" />
              </button>
            </div>
            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white text-black mt-2 rounded-xl overflow-hidden shadow-md max-h-48 overflow-y-auto">
                {suggestions.map((s, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Weather Display */}
        {weatherData && (
          <>
            {/* Temperature Section */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-weather-gradient backdrop-blur-sm rounded-xl p-6 shadow-xl space-y-4 md:space-y-0">
              <div className="space-y-2 text-center md:text-left">
                <div className="flex items-start justify-center md:justify-start space-x-2">
                  <h2 className="text-7xl md:text-8xl text-white font-bold">
                    {Math.round(weatherData.main.temp - 273.15)}
                  </h2>
                  <span className="text-3xl md:text-5xl text-white">°C</span>
                </div>
                <h3 className="text-white text-xl md:text-2xl font-medium">{`${weatherData.name} , ${weatherData.sys.country}`}</h3>
                <h4 className="text-white text-lg md:text-xl capitalize">
                  {weatherData.weather[0].description}
                </h4>
              </div>
              <div className="text-white">
                {getWeatherIcon(weatherData.weather[0].main)}
              </div>
            </div>

            {/* Info Boxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
              <WeatherBox icon={<Droplet size={32} />} title="Humidity" value={`${weatherData.main.humidity}%`} />
              <WeatherBox icon={<GlassWater size={32} />} title="Pressure" value={`${weatherData.main.pressure} hPa`} />
              <WeatherBox icon={<Wind size={32} />} title="Wind Speed" value={`${weatherData.wind.speed} km/h`} />
              <WeatherBox
                icon={<Sun size={32} />}
                title="Feels Like"
                value={`${Math.round(weatherData.main.feels_like - 273.15)} °C`}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const WeatherBox = ({ icon, title, value }) => {
  return (
    <div className="backdrop-blur-sm rounded-2xl p-4 shadow-xl flex flex-col items-center space-y-2 border border-white/20 hover:scale-105 transition-transform">
      <div className="text-white">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
};

export default App;
