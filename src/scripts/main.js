import '../stylesheets/normalize.css';
import '../stylesheets/typography.css';
import '../stylesheets/variables.css';
import '../stylesheets/main.css';

import * as key from './apiKey.json';
import { getData, url } from './call.js';
import { getLocation, getInput } from './location.js';
import { getWeather } from './weather.js';

const btnListener = (func) => {
  const btn = document.querySelector('.search__button');
  btn.addEventListener('click', () => func());
};

const init = async () => {
  const params = {
    lat: '',
    lon: '',
    units: 'metric',
    country: '',
    state: '',
    name: '',
  };

  const updateParams = (params, object) => {
    Object.keys(params).map((key) => {
      if (object[key]) {
        params[key] = object[key];
      }
    });
  };

  const renderWeather = async () => {
    params.name = getInput();
    const location = await getLocation(getData, url, key.openWeather, params);
    updateParams(params, location);

    const weather = await getWeather(getData, url, key.openWeather, params);
    console.log(weather);
    // const weatherData = await getData('weather', url, key.openWeather, params);
    // console.log(weatherData);
  };

  btnListener(renderWeather);

  // const locationData = await getData('geo', url, key.openWeather, params);
  // const coords = await getLocation(getData, url, key.openWeather, params);
  // const weatherData = await getData('weather', url, key.openWeather, params);
  // console.log(locationData);
  // console.log(weatherData);
};

init();
