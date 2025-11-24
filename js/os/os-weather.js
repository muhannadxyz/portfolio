// Weather App
const WeatherApp = (function() {
  // OpenWeatherMap API Key - Get a free key from https://openweathermap.org/api
  // For demo purposes, you can use a free API key
  const API_KEY = 'demo'; // Replace with your OpenWeatherMap API key
  
  // Mock weather data (fallback)
  const mockWeatherData = {
    current: {
      location: 'San Francisco, CA',
      temperature: 68,
      condition: 'Partly Cloudy',
      icon: '⛅',
      humidity: 65,
      windSpeed: 12,
      feelsLike: 70
    },
    forecast: [
      { day: 'Today', high: 72, low: 58, condition: 'Sunny', icon: '☀️' },
      { day: 'Tomorrow', high: 70, low: 56, condition: 'Cloudy', icon: '☁️' },
      { day: 'Wed', high: 68, low: 54, condition: 'Rainy', icon: '🌧️' },
      { day: 'Thu', high: 71, low: 57, condition: 'Partly Cloudy', icon: '⛅' },
      { day: 'Fri', high: 73, low: 59, condition: 'Sunny', icon: '☀️' }
    ]
  };
  
  function getWeatherIcon(condition) {
    const iconMap = {
      'Clear': '☀️',
      'Sun': '☀️',
      'Clouds': '☁️',
      'Cloudy': '☁️',
      'Rain': '🌧️',
      'Rainy': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️',
      'Partly Cloudy': '⛅',
      'Partly cloudy': '⛅'
    };
    return iconMap[condition] || '⛅';
  }
  
  function getDayName(offset = 0) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    today.setDate(today.getDate() + offset);
    if (offset === 0) return 'Today';
    if (offset === 1) return 'Tomorrow';
    return days[today.getDay()].substring(0, 3);
  }
  
  async function getLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        { timeout: 10000, enableHighAccuracy: false }
      );
    });
  }
  
  async function fetchWeatherByCoords(lat, lon) {
    // Try using OpenWeatherMap API if API key is provided
    if (API_KEY && API_KEY !== 'demo') {
      try {
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`;
        
        const [currentRes, forecastRes] = await Promise.all([
          fetch(currentUrl),
          fetch(forecastUrl)
        ]);
        
        if (currentRes.ok && forecastRes.ok) {
          const currentData = await currentRes.json();
          const forecastData = await forecastRes.json();
          
          return formatWeatherData(currentData, forecastData);
        }
      } catch (error) {
        console.error('OpenWeatherMap API error:', error);
      }
    }
    
    // Fallback: Use wttr.in API (free, no API key needed, works with coordinates)
    try {
      const url = `https://wttr.in/${lat},${lon}?format=j1`;
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.ok) {
        const data = await response.json();
        return formatWttrData(data);
      }
    } catch (error) {
      console.error('wttr.in API error:', error);
    }
    
    // Alternative: Use Open-Meteo API (free, no API key, CORS enabled)
    try {
      const currentUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&temperature_unit=fahrenheit&windspeed_unit=mph`;
      const response = await fetch(currentUrl);
      if (response.ok) {
        const data = await response.json();
        return formatOpenMeteoData(data, lat, lon);
      }
    } catch (error) {
      console.error('Open-Meteo API error:', error);
    }
    
    throw new Error('Unable to fetch weather data. Please enable location access or check your internet connection.');
  }
  
  function formatOpenMeteoData(data, lat, lon) {
    const current = data.current;
    const daily = data.daily;
    
    // Get location name (simplified - in production would reverse geocode)
    const location = `Lat: ${lat.toFixed(2)}, Lon: ${lon.toFixed(2)}`;
    
    // Map weather codes to conditions
    const weatherCodeMap = {
      0: { condition: 'Clear', icon: '☀️' },
      1: { condition: 'Mainly Clear', icon: '☀️' },
      2: { condition: 'Partly Cloudy', icon: '⛅' },
      3: { condition: 'Overcast', icon: '☁️' },
      45: { condition: 'Fog', icon: '🌫️' },
      48: { condition: 'Fog', icon: '🌫️' },
      51: { condition: 'Light Drizzle', icon: '🌦️' },
      53: { condition: 'Moderate Drizzle', icon: '🌦️' },
      55: { condition: 'Dense Drizzle', icon: '🌦️' },
      61: { condition: 'Light Rain', icon: '🌧️' },
      63: { condition: 'Moderate Rain', icon: '🌧️' },
      65: { condition: 'Heavy Rain', icon: '🌧️' },
      71: { condition: 'Light Snow', icon: '❄️' },
      73: { condition: 'Moderate Snow', icon: '❄️' },
      75: { condition: 'Heavy Snow', icon: '❄️' },
      80: { condition: 'Light Rain', icon: '🌧️' },
      81: { condition: 'Moderate Rain', icon: '🌧️' },
      82: { condition: 'Heavy Rain', icon: '🌧️' },
      85: { condition: 'Light Snow', icon: '❄️' },
      86: { condition: 'Heavy Snow', icon: '❄️' },
      95: { condition: 'Thunderstorm', icon: '⛈️' },
      96: { condition: 'Thunderstorm', icon: '⛈️' },
      99: { condition: 'Thunderstorm', icon: '⛈️' }
    };
    
    const currentWeather = weatherCodeMap[current.weather_code] || { condition: 'Unknown', icon: '⛅' };
    
    const weather = {
      current: {
        location: location,
        temperature: Math.round(current.temperature_2m),
        condition: currentWeather.condition,
        icon: currentWeather.icon,
        humidity: Math.round(current.relative_humidity_2m),
        windSpeed: Math.round(current.wind_speed_10m),
        feelsLike: Math.round(current.temperature_2m) // Open-Meteo doesn't provide feels like
      },
      forecast: daily.time.slice(0, 5).map((date, index) => {
        const code = daily.weather_code[index];
        const weatherInfo = weatherCodeMap[code] || { condition: 'Unknown', icon: '⛅' };
        return {
          day: getDayName(index),
          high: Math.round(daily.temperature_2m_max[index]),
          low: Math.round(daily.temperature_2m_min[index]),
          condition: weatherInfo.condition,
          icon: weatherInfo.icon
        };
      })
    };
    
    return weather;
  }
  
  function formatWeatherData(currentData, forecastData) {
    const current = {
      location: `${currentData.name}, ${currentData.sys.country || ''}`,
      temperature: Math.round(currentData.main.temp),
      condition: currentData.weather[0].main,
      icon: getWeatherIcon(currentData.weather[0].main),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed || 0),
      feelsLike: Math.round(currentData.main.feels_like)
    };
    
    const forecast = [];
    if (forecastData && forecastData.list) {
      // Group forecast by day and get daily min/max
      const dailyData = {};
      forecastData.list.slice(0, 40).forEach(item => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toDateString();
        if (!dailyData[dayKey]) {
          dailyData[dayKey] = {
            temps: [],
            conditions: [],
            date: date
          };
        }
        dailyData[dayKey].temps.push(item.main.temp);
        dailyData[dayKey].conditions.push(item.weather[0].main);
      });
      
      let dayOffset = 0;
      Object.keys(dailyData).slice(0, 5).forEach(dayKey => {
        const day = dailyData[dayKey];
        const high = Math.round(Math.max(...day.temps));
        const low = Math.round(Math.min(...day.temps));
        const mostCommonCondition = day.conditions.sort((a, b) =>
          day.conditions.filter(v => v === a).length - day.conditions.filter(v => v === b).length
        ).pop();
        
        forecast.push({
          day: getDayName(dayOffset),
          high: high,
          low: low,
          condition: mostCommonCondition,
          icon: getWeatherIcon(mostCommonCondition)
        });
        dayOffset++;
      });
    } else {
      // Generate forecast from current data
      for (let i = 0; i < 5; i++) {
        forecast.push({
          day: getDayName(i),
          high: current.temperature + Math.floor(Math.random() * 10) - 5,
          low: current.temperature - Math.floor(Math.random() * 15) - 5,
          condition: current.condition,
          icon: current.icon
        });
      }
    }
    
    return { current, forecast };
  }
  
  function formatWttrData(data) {
    const current = data.current_condition[0];
    const location = data.nearest_area[0];
    
    return {
      current: {
        location: `${location.areaName[0].value}, ${location.country[0].value}`,
        temperature: parseInt(current.temp_F),
        condition: current.weatherDesc[0].value,
        icon: getWeatherIcon(current.weatherDesc[0].value),
        humidity: parseInt(current.humidity),
        windSpeed: parseInt(current.windspeedMiles),
        feelsLike: parseInt(current.FeelsLikeF)
      },
      forecast: data.weather.slice(0, 5).map((day, index) => ({
        day: getDayName(index),
        high: parseInt(day.maxtempF),
        low: parseInt(day.mintempF),
        condition: day.hourly[4].weatherDesc[0].value,
        icon: getWeatherIcon(day.hourly[4].weatherDesc[0].value)
      }))
    };
  }
  
  function createWeatherContent() {
    const container = document.createElement('div');
    container.className = 'weather-container';
    container.style.cssText = 'height: 100%; overflow-y: auto; font-family: -apple-system, sans-serif; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 24px;';
    
    // Show loading state
    container.innerHTML = `
      <div style="text-align: center; padding: 60px 20px;">
        <div style="font-size: 48px; margin-bottom: 16px;">🌤️</div>
        <div style="color: #00ffe1; font-size: 18px; margin-bottom: 8px;">Loading weather...</div>
        <div style="color: #999; font-size: 14px;">Getting your location</div>
      </div>
    `;
    
    // Fetch weather data
    loadWeatherData(container);
    
    return container;
  }
  
  async function loadWeatherData(container) {
    try {
      // Get user's location
      const location = await getLocation();
      
      // Fetch weather data
      const weather = await fetchWeatherByCoords(location.lat, location.lon);
      
      // Render weather data
      renderWeather(container, weather);
    } catch (error) {
      console.error('Error loading weather:', error);
      
      // Show error with option to use mock data
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px;">
          <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
          <div style="color: #ff5f57; font-size: 18px; margin-bottom: 8px;">Unable to load weather</div>
          <div style="color: #999; font-size: 14px; margin-bottom: 24px;">${error.message}</div>
          <button id="use-mock-weather" style="
            padding: 12px 24px;
            background: rgba(0, 255, 225, 0.1);
            border: 1px solid rgba(0, 255, 225, 0.3);
            border-radius: 8px;
            color: #00ffe1;
            cursor: pointer;
            font-size: 14px;
          ">Use Demo Data</button>
        </div>
      `;
      
      container.querySelector('#use-mock-weather').addEventListener('click', () => {
        renderWeather(container, mockWeatherData);
      });
    }
  }
  
  function renderWeather(container, weather) {
    
    container.innerHTML = `
      <!-- Current Weather Card -->
      <div class="weather-current" style="
        background: rgba(0, 255, 225, 0.1);
        border: 1px solid rgba(0, 255, 225, 0.2);
        border-radius: 20px;
        padding: 32px;
        margin-bottom: 24px;
        text-align: center;
        backdrop-filter: blur(10px);
      ">
        <div style="font-size: 64px; margin-bottom: 16px; filter: drop-shadow(0 0 20px rgba(0, 255, 225, 0.3));">
          ${weather.current.icon}
        </div>
        <div style="font-size: 72px; font-weight: 300; color: #00ffe1; margin-bottom: 8px; line-height: 1;">
          ${weather.current.temperature}°
        </div>
        <div style="font-size: 18px; color: #e6e6e6; margin-bottom: 4px;">
          ${weather.current.condition}
        </div>
        <div style="font-size: 14px; color: #999; margin-bottom: 20px;">
          ${weather.current.location}
        </div>
        <div style="display: flex; justify-content: center; gap: 24px; margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(0, 255, 225, 0.1);">
          <div style="text-align: center;">
            <div style="font-size: 12px; color: #999; margin-bottom: 4px;">Feels Like</div>
            <div style="font-size: 18px; color: #00ffe1; font-weight: 600;">${weather.current.feelsLike}°</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 12px; color: #999; margin-bottom: 4px;">Humidity</div>
            <div style="font-size: 18px; color: #00ffe1; font-weight: 600;">${weather.current.humidity}%</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 12px; color: #999; margin-bottom: 4px;">Wind</div>
            <div style="font-size: 18px; color: #00ffe1; font-weight: 600;">${weather.current.windSpeed} mph</div>
          </div>
        </div>
      </div>
      
      <!-- Forecast Section -->
      <div style="margin-bottom: 16px;">
        <h3 style="color: #00ffe1; font-size: 18px; margin-bottom: 16px; font-weight: 600;">5-Day Forecast</h3>
        <div class="weather-forecast" style="display: flex; flex-direction: column; gap: 12px;">
          ${weather.forecast.map((day, index) => `
            <div class="forecast-item" style="
              background: rgba(30, 30, 30, 0.5);
              border: 1px solid rgba(0, 255, 225, 0.1);
              border-radius: 12px;
              padding: 16px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              transition: all 0.2s;
              cursor: pointer;
            " data-index="${index}">
              <div style="display: flex; align-items: center; gap: 16px; flex: 1;">
                <div style="font-size: 32px; width: 48px; text-align: center;">
                  ${day.icon}
                </div>
                <div style="flex: 1;">
                  <div style="color: #e6e6e6; font-weight: 600; font-size: 16px; margin-bottom: 4px;">
                    ${day.day}
                  </div>
                  <div style="color: #999; font-size: 13px;">
                    ${day.condition}
                  </div>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="text-align: right;">
                  <div style="color: #00ffe1; font-size: 18px; font-weight: 600;">
                    ${day.high}°
                  </div>
                  <div style="color: #666; font-size: 14px;">
                    ${day.low}°
                  </div>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Refresh Button -->
      <div style="text-align: center; margin-top: 24px;">
        <button id="refresh-weather" style="
          padding: 10px 20px;
          background: rgba(0, 255, 225, 0.1);
          border: 1px solid rgba(0, 255, 225, 0.3);
          border-radius: 8px;
          color: #00ffe1;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        ">🔄 Refresh Weather</button>
      </div>
      
      ${API_KEY === 'demo' ? `
      <!-- Info Section -->
      <div style="
        background: rgba(0, 255, 225, 0.05);
        border: 1px solid rgba(0, 255, 225, 0.1);
        border-radius: 12px;
        padding: 16px;
        margin-top: 16px;
      ">
        <div style="color: #999; font-size: 12px; text-align: center; line-height: 1.6;">
          <div style="margin-bottom: 8px;">🌡️ Using location-based weather</div>
          <div>For better accuracy, get a free API key from <a href="https://openweathermap.org/api" target="_blank" style="color: #00ffe1;">OpenWeatherMap</a></div>
        </div>
      </div>
      ` : ''}
    `;
    
    // Add hover effects to forecast items
    setTimeout(() => {
      container.querySelectorAll('.forecast-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
          item.style.background = 'rgba(0, 255, 225, 0.1)';
          item.style.borderColor = 'rgba(0, 255, 225, 0.3)';
          item.style.transform = 'translateX(4px)';
        });
        
        item.addEventListener('mouseleave', () => {
          item.style.background = 'rgba(30, 30, 30, 0.5)';
          item.style.borderColor = 'rgba(0, 255, 225, 0.1)';
          item.style.transform = 'translateX(0)';
        });
      });
      
      // Refresh button
      const refreshBtn = container.querySelector('#refresh-weather');
      if (refreshBtn) {
        refreshBtn.addEventListener('mouseenter', () => {
          refreshBtn.style.background = 'rgba(0, 255, 225, 0.2)';
          refreshBtn.style.borderColor = 'rgba(0, 255, 225, 0.4)';
        });
        
        refreshBtn.addEventListener('mouseleave', () => {
          refreshBtn.style.background = 'rgba(0, 255, 225, 0.1)';
          refreshBtn.style.borderColor = 'rgba(0, 255, 225, 0.3)';
        });
        
        refreshBtn.addEventListener('click', () => {
          refreshBtn.textContent = '🔄 Refreshing...';
          refreshBtn.disabled = true;
          loadWeatherData(container).finally(() => {
            refreshBtn.textContent = '🔄 Refresh Weather';
            refreshBtn.disabled = false;
          });
        });
      }
    }, 100);
    
    return container;
  }
  
  
  function open() {
    const existing = WindowManager.getWindowByApp('weather');
    if (existing) {
      WindowManager.focusWindow(existing.id);
      return;
    }
    
    const content = createWeatherContent();
    WindowManager.createWindow('weather', 'Weather', content, {
      width: 500,
      height: 600,
      left: 350,
      top: 100
    });
  }
  
  return {
    open
  };
})();

window.WeatherApp = WeatherApp;

