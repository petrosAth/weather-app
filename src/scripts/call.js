const url = (key, params) => {
  return {
    weather: `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&appid=${key}&units=${params.units}`,
    geo: `https://api.openweathermap.org/geo/1.0/direct?q=${params.name}&limit=1&appid=${key}`,
  };
};

const getData = async (type, url, key, params) => {
  try {
    const response = await fetch(url(key, params)[type], {
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

export { getData, url };
