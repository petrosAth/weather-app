import '../stylesheets/normalize.css';
import '../stylesheets/typography.css';
import '../stylesheets/variables.css';
import '../stylesheets/main.css';

import * as key from './apiKeys.json';
import { url, getData } from './weather/call.js';
import { getLocation } from './weather/getLocation.js';
import { getWeather, getForecastDates, getForecast } from './weather/getWeather.js';

const getInput = () => {
  const input = document.querySelector('.search__input');
  return input.value;
};

const btnListener = (fn) => {
  const btn = document.querySelector('.search__button');
  btn.addEventListener('click', () => fn());
};

const init = async () => {
  const createMappedObject = (dataMap, data) => {
    const newObject = {};
    Object.keys(dataMap).map((key) => {
      if (data[dataMap[key]]) {
        newObject[key] = data[dataMap[key]];
      }
    });
    return newObject;
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

  const weather = (lat, lon) => {
    const params = {
      lat: lat,
      lon: lon,
      units: 'metric',
    };

    const weatherInfo = (weatherData, date) => {
      const weatherDataMap = {
        details: {
          temp: 'temp',
          tempMin: 'temp_min',
          tempMax: 'temp_max',
          humidity: 'humidity',
        },
        weather: {
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

    const current = async () => {
      params.type = 'weather';
      const weatherData = await getWeather(getData, url, key.openWeather, params);
      return weatherInfo(weatherData);
    };

    const forecast = async () => {
      params.type = 'forecast';
      const weatherData = await getWeather(getData, url, key.openWeather, params);
      const forecastData = getForecast(getForecastDates(3), weatherData.list);

      const forecast = [];
      forecastData.forEach((forecastDayData) => forecast.push(weatherInfo(forecastDayData, true)));

      return forecast;
    };

    return {
      current,
      forecast,
    };
  };

  const renderWeather = async () => {
    const newLocation = await location();
    // console.log(newLocation);
    const weatherCurrent = await weather(newLocation.lat, newLocation.lon).current();
    // console.log(weatherCurrent);
    const weatherForecast = await weather(newLocation.lat, newLocation.lon).forecast();
    // console.log(weatherForecast);
  };

  btnListener(renderWeather);
};

init();
