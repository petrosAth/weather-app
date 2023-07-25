const getWeather = async (apiCall, url, key, params) => {
  const weatherData = await apiCall(url(key, params).weather);
  return weatherData;
};

const getForecast = (dates, weatherData) => {
  return weatherData.filter((timestamp) => dates.includes(timestamp.dt_txt));
};

const fixOneDecimal = (num) => {
  return parseFloat((Math.round(num * 10) / 10).toFixed(1));
};

const getFormatedDate = (daysToForcast, hour) => {
  const d = new Date();
  const twoDigits = (num) => ('0' + num).slice(-2);
  const formatDate = () => {
    let date = `${d.getFullYear()}-${twoDigits(d.getMonth() + 1)}-${twoDigits(d.getDate())}`;
    if (hour) {
      date = date + ` ${hour}:00:00`;
    }
    return date;
  };

  if (daysToForcast) {
    const fullDates = [];

    for (let index = 0; index < daysToForcast; index++) {
      d.setDate(d.getDate() + 1);
      fullDates.push(formatDate());
    }

    return fullDates;
  }

  return formatDate();
};

const extractEdgeTemp = (forecastData, dates) => {
  const temps = [];
  const getMax = (day) => Math.max(...day.map((day) => day.main.temp_max));
  const getMin = (day) => Math.min(...day.map((day) => day.main.temp_min));
  dates.forEach((date) => {
    const dayTimestamps = forecastData.list.filter((timestamp) => timestamp.dt_txt.slice(0, 10) == date);
    temps.push({ max: getMax(dayTimestamps), min: getMin(dayTimestamps) });
  });
  return temps;
};

export { getWeather, getForecast, fixOneDecimal, getFormatedDate, extractEdgeTemp };
