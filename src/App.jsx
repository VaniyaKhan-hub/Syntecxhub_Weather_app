import axios from "axios";
import {
  Droplet,
  GlassWater,
  Sun,
  Wind,
  CloudRain,
  Search,
} from "lucide-react";
import React, { useEffect, useState } from "react";

const popularCities = [
  // Pakistan
  { name: "Islamabad", country: "PK" },
  { name: "Hyderabad", country: "PK" },
  { name: "Karachi", country: "PK" },
  { name: "Lahore", country: "PK" },
  { name: "Rawalpindi", country: "PK" },
  { name: "Faisalabad", country: "PK" },
  { name: "Multan", country: "PK" },
  { name: "Peshawar", country: "PK" },
  { name: "Quetta", country: "PK" },
  { name: "Sialkot", country: "PK" },
  { name: "Gujranwala", country: "PK" },

  // India
  { name: "Delhi", country: "IN" },
  { name: "Mumbai", country: "IN" },
  { name: "Bengaluru", country: "IN" },
  { name: "Chennai", country: "IN" },
  { name: "Kolkata", country: "IN" },
  { name: "Pune", country: "IN" },
  { name: "Jaipur", country: "IN" },
  { name: "Ahmedabad", country: "IN" },
  { name: "Chandigarh", country: "IN" },

  // Turkey
  { name: "Istanbul", country: "TR" },
  { name: "Ankara", country: "TR" },

  // Belgium
  { name: "Brussels", country: "BE" },
  { name: "Antwerp", country: "BE" },
  { name: "Ghent", country: "BE" },

  // USA
  { name: "New York", country: "US" },
  { name: "Los Angeles", country: "US" },
  { name: "Chicago", country: "US" },
  { name: "San Francisco", country: "US" },

  // UK
  { name: "London", country: "GB" },
  { name: "Manchester", country: "GB" },
  { name: "Birmingham", country: "GB" },

  // Canada
  { name: "Toronto", country: "CA" },
  { name: "Vancouver", country: "CA" },
  { name: "Montreal", country: "CA" },

  // UAE
  { name: "Dubai", country: "AE" },
  { name: "Abu Dhabi", country: "AE" },

  // Japan
  { name: "Tokyo", country: "JP" },
  { name: "Osaka", country: "JP" },

  // Australia
  { name: "Sydney", country: "AU" },
  { name: "Melbourne", country: "AU" },
  { name: "Brisbane", country: "AU" },

  // France
  { name: "Paris", country: "FR" },
  { name: "Lyon", country: "FR" },

  // Germany
  { name: "Berlin", country: "DE" },
  { name: "Munich", country: "DE" },
  { name: "Frankfurt", country: "DE" },

  // Italy
  { name: "Rome", country: "IT" },
  { name: "Milan", country: "IT" },

  // Spain
  { name: "Madrid", country: "ES" },
  { name: "Barcelona", country: "ES" },
];


const App = () => {
  const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  /* SEARCH INPUT */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setCity(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const matches = popularCities
      .filter((c) =>
        c.name.toLowerCase().startsWith(value.toLowerCase())
      )
      .slice(0, 8);

    setSuggestions(matches);
  };

  /* FETCH WEATHER */
  const getWeatherData = async (cityObj = null) => {
    const selected =
      cityObj ||
      popularCities.find(
        (c) => c.name.toLowerCase() === city.toLowerCase()
      );

    if (!selected) {
      alert("Please select a city from suggestions.");
      return;
    }

    try {
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            q: `${selected.name},${selected.country}`,
            appid: apiKey,
            units: "metric", // Celsius
          },
        }
      );

      setWeatherData(response.data);
      setCity("");
      setSuggestions([]);
    } catch (error) {
      console.error(error);
      alert("Weather data not found.");
    }
  };

  const handleSuggestionClick = (cityObj) => {
    setCity(cityObj.name);
    getWeatherData(cityObj);
  };

  /* ICON SELECTOR */
  const getWeatherIcon = (main) => {
    switch (main) {
      case "Clear":
        return <Sun size={80} />;
      case "Clouds":
      case "Rain":
      case "Drizzle":
      case "Thunderstorm":
        return <CloudRain size={80} />;
      case "Mist":
      case "Fog":
        return <Wind size={80} />;
      default:
        return <CloudRain size={80} />;
    }
  };

  /* DEFAULT CITY */
  useEffect(() => {
    getWeatherData({ name: "Islamabad", country: "PK" });
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center bg-weather-gradient px-4">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-md p-8 rounded-2xl space-y-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <h1 className="text-4xl font-bold text-white">GlobeWeather</h1>

          <div className="relative w-full md:w-80">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={city}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === "Enter" && getWeatherData()}
                placeholder="Search city"
                className="w-full px-4 py-2 rounded-xl bg-white/20 text-white placeholder-white outline-none"
              />
              <button onClick={() => getWeatherData()}>
                <Search className="text-white" />
              </button>
            </div>

            {suggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white rounded-xl mt-2 shadow-lg">
                {suggestions.map((s, i) => (
                  <li
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-4 py-2 hover:bg-purple-100 cursor-pointer"
                  >
                    {s.name}, {s.country}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* WEATHER */}
        {weatherData && (
          <>
            <div className="flex flex-col md:flex-row justify-between items-center bg-white/10 rounded-xl p-6">
              <div className="text-white space-y-2">
                <h2 className="text-7xl font-bold">
                  {Math.round(weatherData.main.temp)}°C
                </h2>
                <h3 className="text-xl">
                  {weatherData.name}, {weatherData.sys.country}
                </h3>
                <p className="capitalize">
                  {weatherData.weather[0].description}
                </p>
              </div>
              {getWeatherIcon(weatherData.weather[0].main)}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
              <WeatherBox icon={<Droplet />} title="Humidity" value={`${weatherData.main.humidity}%`} />
              <WeatherBox icon={<GlassWater />} title="Pressure" value={`${weatherData.main.pressure} hPa`} />
              <WeatherBox icon={<Wind />} title="Wind" value={`${weatherData.wind.speed} m/s`} />
              <WeatherBox icon={<Sun />} title="Feels Like" value={`${Math.round(weatherData.main.feels_like)}°C`} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* INFO BOX */
// const WeatherBox = ({ icon, title, value }) => (
//   <div className="bg-white/10 rounded-xl p-4 text-center space-y-2">
//     <div className="flex justify-center">{icon}</div>
//     <h3 className="font-semibold">{title}</h3>
//     <p className="font-bold">{value}</p>
//   </div>
// );
const WeatherBox = ({ icon, title, value }) => {
   return (
   <div className="backdrop-blur-sm rounded-2xl p-4 shadow-xl flex flex-col items-center space-y-2 border border-white/20 hover:scale-105 transition-transform">
     <div className="text-white">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3> 
      <p className="text-xl font-bold">{value}</p>
       </div>); };
export default App;
