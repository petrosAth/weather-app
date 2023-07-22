const getWeather = async (apiCall, url, key, params) => {
  const weatherData = await apiCall('weather', url, key, params);
  const weather = {
    temp: weatherData.main.temp,
    tempMax: weatherData.main.temp_max,
    tempLow: weatherData.main.temp_low,
    humidity: weatherData.main.humidity,
    description: ''
  };
  return weatherData;
};

export { getWeather };
