const getWeather = async (apiCall, url, key, params) => {
  const weatherData = await apiCall(url(key, params).weather);
  return weatherData;
};

const getForecastDates = (daysToForcast) => {
  const d = new Date();
  const twoDigits = (num) => ('0' + num).slice(-2);
  const timeOfForecast = 12;
  const forecastDates = [];
  const formatDate = (hour) =>
    `${d.getFullYear()}-${twoDigits(d.getMonth() + 1)}-${twoDigits(d.getDate())} ${hour}:00:00`;

  for (let index = 0; index < daysToForcast; index++) {
    d.setDate(d.getDate() + 1);
    forecastDates.push(formatDate(timeOfForecast));
  }

  return forecastDates;
};

const getForecast = (dates, weatherData) => {
  return weatherData.filter((timestamp) => dates.includes(timestamp.dt_txt));
};

export { getWeather, getForecastDates, getForecast };
