import React, { useEffect, useState, useRef } from 'react';
import './Weather.css';

import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import mist_icon from '../assets/mist.png';
import thunder_icon from '../assets/thunderstorm.png';

export const Weather = () => {
    const inputRef = useRef();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isDay, setIsDay] = useState(true);

    
    const allIcons = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
        "50d": mist_icon,
        "11d": thunder_icon,
    };

    const search = async (city) => {
        if (city === "") {
            alert("Enter city name");
            return;
        }
        setLoading(true);
        setError('');
        
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
            const response = await fetch(url);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            const icon = allIcons[data.weather[0].icon] || clear_icon;
            const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
            setIsDay(currentTime >= data.sys.sunrise && currentTime < data.sys.sunset); // Determinar si es de día

            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: Math.floor(data.main.temp),
                location: data.name,
                icon: icon
            });
            inputRef.current.value = ''; // Clear input after search
        } catch (err) {
            setError(err.message);
            setWeatherData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        search("London");
    }, []);

    return (
        <div className={`weather ${isDay ? 'day' : 'night'}`}> 
            <div className="search-bar">
                <input ref={inputRef} type="text" placeholder='Search' id='search-bar-input' />
                <img src={search_icon} alt="" onClick={() => { search(inputRef.current.value) }} />
            </div>
            {loading && <p>Loading...</p>}
            {error && <p className="error">{error}</p>}
            {weatherData && <>
                <img src={weatherData.icon} alt="" className='weather-icon' />
                <p className='temperature'>{weatherData.temperature}°C</p>
                <p className='location'>{weatherData.location}</p>
                <div className="weather-data">
                    <div className="col">
                        <img src={humidity_icon} alt="" />
                        <div>
                            <p>{weatherData.humidity}%</p>
                            <span>Humidity</span>
                        </div>
                    </div>
                    <div className="col">
                        <img src={wind_icon} alt="" />
                        <div>
                            <p>{weatherData.windSpeed} km/h</p>
                            <span>Wind speed</span>
                        </div>
                    </div>
                </div>
            </>}
        </div>
    );
};

export default Weather;
