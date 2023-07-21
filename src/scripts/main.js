import '../stylesheets/normalize.css';
import '../stylesheets/typography.css';
import '../stylesheets/variables.css';
import '../stylesheets/main.css';

const apiInfo = () => {
  const lat = 39.63;
  const lon = 22.41;
  const key = '8c6809504e25cdd6896385597447d077';
  const units = 'metric'
  const callURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${units}`;

  return callURL;
};

const getWeatherData = async () => {
  const data = await fetch(apiInfo(), {
    mode: 'cors',
  });
  const dataJson = await data.json();
  console.log(dataJson);
};

getWeatherData();
