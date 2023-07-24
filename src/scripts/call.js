const url = (key, params) => {
  return {
    weather: `https://api.openweathermap.org/data/2.5/${params.type}?lat=${params.lat}&lon=${params.lon}&appid=${key}&units=${params.units}`,
    geo: `https://api.openweathermap.org/geo/1.0/direct?q=${params}&limit=1&appid=${key}`,
  };
};

const getData = async (url) => {
  try {
    const response = await fetch(url, {
      mode: 'cors',
    });
    if (response.status === 200) {
      const data = await response.json();

      return data;
    } else {
      console.log('Server error: ', response);
    }
  } catch (err) {
    console.log(`Error: in function ${getData.name}\n${err}`);
  }
};

const getLocation = async (apiCall, url, key, location) => {
  const newLocation = await apiCall(url(key, location)['geo']);
  return newLocation;
};

const getWeather = async (apiCall, url, key, params) => {
  const weatherData = await apiCall(url(key, params)['weather']);
  return weatherData;
};

export { url, getData, getLocation, getWeather };
