import '../stylesheets/normalize.css';
import '../stylesheets/typography.css';
import '../stylesheets/variables.css';
import '../stylesheets/main.css';

import * as key from './apiKeys.json';
import { url, getData } from './weather/call.js';
import { getLocation } from './weather/getLocation.js';
import { getWeather, getForecast, fixOneDecimal, getFormatedDate, extractEdgeTemp } from './weather/getWeather.js';

const getInput = () => {
  const input = document.querySelector('.search__input');
  return input.value;
};

const btnListener = (fn) => {
  const btn = document.querySelector('.search__button');
  btn.addEventListener('click', () => fn());
};

const location = async () => {
  const locationDataMap = {
    lat: 'lat',
    lon: 'lon',
    country: 'country',
    state: 'state',
    name: 'name',
  };
  const location = await getLocation(getData, url, key.openWeather, getInput());
  return createMappedObject(locationDataMap, { ...location[0] });
};

const createMappedObject = (dataMap, data) => {
  const newObject = {};
  Object.keys(dataMap).map((key) => {
    if (data[dataMap[key]]) {
      newObject[key] = data[dataMap[key]];
    }
  });
  return newObject;
};

const weather = (lat, lon, opt) => {
  const params = {
    lat: lat,
    lon: lon,
    units: opt.units,
  };

  const weatherInfo = (weatherData, date) => {
    const weatherDataMap = {
      details: {
        temp: 'temp',
        humidity: 'humidity',
      },
      weather: {
        state: 'main',
        desc: 'description',
        icon: 'icon',
      },
    };

    const info = {
      details: createMappedObject(weatherDataMap.details, { ...weatherData.main }),
      weather: createMappedObject(weatherDataMap.weather, { ...weatherData.weather[0] }),
    };

    if (date) {
      info.date = new Date(Date.parse(weatherData.dt_txt)).toLocaleString('default', { weekday: 'long' });
    }

    return info;
  };

  const addEdgeTemps = (weather, edgeTemps) => {
    edgeTemps.forEach((temps, index) => {
      // console.log('weather: ', weather);
      // console.log('temps: ', temps);
      weather[index].details['tempMax'] = temps.max;
      weather[index].details['tempMin'] = temps.min;
    });
    return weather;
  };

  const current = async () => {
    params.type = 'weather';
    const currentWeatherData = await getWeather(getData, url, key.openWeather, params);

    params.type = 'forecast';
    const forecastWeatherData = await getWeather(getData, url, key.openWeather, params);

    const edgeTemps = extractEdgeTemp(forecastWeatherData, [getFormatedDate()]);

    let weather = weatherInfo(currentWeatherData);

    weather = addEdgeTemps([weather], edgeTemps);

    return weather;
  };

  const forecast = async () => {
    params.type = 'forecast';
    const forecastWeatherData = await getWeather(getData, url, key.openWeather, params);
    const forecastWeather = getForecast(getFormatedDate(4, 12), forecastWeatherData.list);

    const edgeTemps = extractEdgeTemp(forecastWeatherData, getFormatedDate(4));

    let forecast = [];
    forecastWeather.forEach((forecastDayData) => forecast.push(weatherInfo(forecastDayData, true)));

    forecast = addEdgeTemps(forecast, edgeTemps);

    return forecast;
  };

  return {
    current,
    forecast,
  };
};

const init = async () => {
  const opt = {
    units: 'metric',
    symbol: {
      metric: '°C',
      imperial: '°F',
      standard: 'K',
      humidity: '%',
    },
  };

  const renderIcon = (location, weather, forecast) => {
    const render = (weather, className, location) => {
      console.log(className);
      const icon = document.querySelector(`.${className}`);
      console.log(icon);

      const formatValue = (value) => `${fixOneDecimal(value)}${opt.symbol[opt.units]}`;
      if (className === 'current') {
        icon.querySelector('.weather__icon__temp').innerHTML = formatValue(weather.details.temp);
        icon.querySelector('.weather__icon__desc').innerHTML = weather.weather.state;
      }
      icon.querySelector('.weather__icon__temp-max').innerHTML = formatValue(weather.details.tempMax);
      icon.querySelector('.weather__icon__temp-low').innerHTML = formatValue(weather.details.tempMin);
      icon.querySelector('.weather__icon__humidity').innerHTML = weather.details.humidity + opt.symbol['humidity'];
    };

    render(weather, 'current', location);
    forecast.forEach((forecastDay, index) => render(forecastDay, `day${index + 1}`));
  };

  const renderWeather = async () => {
    const newLocation = await location();
    // console.log(newLocation);
    const weatherCurrent = await weather(newLocation.lat, newLocation.lon, opt).current();
    // console.log(weatherCurrent);
    const weatherForecast = await weather(newLocation.lat, newLocation.lon, opt).forecast();
    // console.log(weatherForecast);
    renderIcon(newLocation, ...weatherCurrent, weatherForecast);
    // renderIcon(newLocation, weatherForecast);
  };

  btnListener(renderWeather);
};

init();
