import '../stylesheets/normalize.css';
import '../stylesheets/typography.css';
import '../stylesheets/variables.css';
import '../stylesheets/main.css';

const sitename =
  'https://petrosath.github.io/weather-app/  - Contact info: https://github.com/petrosAth, develop@athanasoulis.me';
const locationForecastURL =
  'https://api.met.no/weatherapi/locationforecast/2.0/complete?altitude=67&lat=39.63&lon=22.41';
const useragent = {
  'User-Agent': sitename,
};

const getWeatherData = async () => {
  const data = await fetch(locationForecastURL, {
    headers: useragent,
    mode: 'cors',
  });
  const dataJson = await data.json();
  // const weather = [
  //   dataJson.properties.timeseries[0].data.instant.details,
  //   dataJson.properties.timeseries[0].data.next_1_hours.summary.symbol_code,
  //   dataJson,
  // ];
  // return weather;
  return dataJson;
};

const getTimestamp = () => {
  const d = new Date();
  const twoDigit = (int) => ('0' + int).slice(-2);
  const formatDate = (day, time) => {
    return `${d.getFullYear()}-${twoDigit(d.getMonth() + 1)}-${twoDigit(d.getDate() + day)}T${
      time || twoDigit(d.getHours())
    }:00:00Z`;
  };

  return {
    current: formatDate(0),
    day1: formatDate(1, 12),
    day2: formatDate(2, 12),
    day3: formatDate(3, 12),
  };
};

const getTimeseriesIndexes = async (weatherData, timestamp) => {
  const log = await weatherData();
  const indexes = [];
  const isDate = (timestamp) => {
    return log.properties.timeseries.findIndex((timeseries) => timeseries.time === timestamp[1]);
  };
  Object.entries(timestamp()).forEach((timestamp) => {
    indexes.push(isDate(timestamp));
  });
  return indexes;
};

const logWeather = async (weatherData, timeseriesIndexes) => {
  const log = await weatherData();
  const indexes = await timeseriesIndexes;
  console.log(indexes);
  return [
    {
      log: log.properties.timeseries[indexes[0]],
      temperature: log.properties.timeseries[indexes[0]].data.instant.details.air_temperature,
    },
    {
      log: log.properties.timeseries[indexes[1]],
      temperature: log.properties.timeseries[indexes[1]],
    },
    {
      log: log.properties.timeseries[indexes[2]],
      temperature: log.properties.timeseries[indexes[2]],
    },
    {
      log: log.properties.timeseries[indexes[3]],
      temperature: log.properties.timeseries[indexes[3]],
    },
  ];
};

const getAsync = async (func) => console.log(await func);

getAsync(logWeather(getWeatherData, getTimeseriesIndexes(getWeatherData, getTimestamp)));
