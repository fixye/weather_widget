import "./style.css";
import key from "./key";

const url = `https://api.openweathermap.org/data/2.5/weather?lat=50.1424&lon=15.1188&appid=${key}`;
const iconUrl = `https://openweathermap.org/img/wn/{icon}@2x.png`
const zeroK = 273.15;

async function getWeatherData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

getWeatherData(url).then((data) => {
    const { name } = data;
    const {
        main: { temp: actualTemp },
        main: { feels_like: feelsLikeTemp },
    } = data;
    const {
        wind: { speed: windSpeed, deg: windDeg, gust: windGust },
    } = data;
    const {
        sys: { sunrise: sunrise, sunset: sunset },
    } = data;
    const { weather: [{ icon: currentWeatherIcon }] } = data
    const currentWeather = data.weather[0].main;
    const actualTempCelc = (actualTemp - zeroK).toFixed(0);
    const feelsLikeTempCelc = (feelsLikeTemp - zeroK).toFixed(0)

});

function feedComponent(element, data) {
    element.textContent = data;
}
