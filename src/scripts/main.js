import '../stylesheets/normalize.css';
import '../stylesheets/typography.css';
import '../stylesheets/variables.css';
import '../stylesheets/main.css';

import * as key from './apiKey.json';
import { url, getData, getLocation, getWeather } from './call.js';

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
      if (data[key]) {
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
      type: 'forecast',
      exclude: 'minutely,hourly,alerts',
      units: 'metric',
    };

    const current = async () => {
      const weather = await getWeather(getData, url, key.openWeather, params);
      return weather;
    };

    return {
      current,
    };
  };

  const renderWeather = async () => {
    const newLocation = await location();
    const currentWeather = await weather(newLocation.lat, newLocation.lon).current();
    console.log(currentWeather);
  };

  btnListener(renderWeather);
};

init();
