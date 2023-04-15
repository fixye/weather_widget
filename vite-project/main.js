import "./style.css";
import key from "./key";

const url = `https://api.openweathermap.org/data/2.5/weather?lat=50.1424&lon=15.1188&appid=${key}`;
const iconUrl = `https://openweathermap.org/img/wn/{icon}@2x.png`
const zeroK = 273.15;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const date = new Date()

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
        wind: { speed: windSpeed, deg: windDeg, gust: windGusts },
    } = data;
    const {
        sys: { sunrise: sunrise, sunset: sunset },
    } = data;
    const { weather: [{ icon: currentWeatherIcon }] } = data
    const currentWeather = data.weather[0].main;
    const actualTempCelc = (actualTemp - zeroK).toFixed(0);
    const feelsLikeTempCelc = (feelsLikeTemp - zeroK).toFixed(0)
    feedComponent(document.querySelector('.date'), `${months[date.getMonth()]} ${date.getDate()}`)
    feedComponent(document.querySelector('.day'), days[date.getDay()])
    feedComponent(document.querySelector('.big-number'), `${actualTempCelc}`)
    feedComponent(document.querySelector('#fl'), `${feelsLikeTempCelc}`)
    document.querySelector('.icon').src = `https://openweathermap.org/img/wn/${currentWeatherIcon}@2x.png`
    feedComponent(document.querySelector('.name'), `${name} CZ`)
    document.querySelector('.arrow').style.cssText = `
        transform-origin: 50% 50%;
        transform: rotate(${90 + windDeg}deg) scale(.4);
    }
    `
    feedComponent(document.querySelector('.wind-speed'), `${windSpeed} m/s`)
    feedComponent(document.querySelector('.gusts-speed'), `${windGusts} m/s`)
});

function feedComponent(element, content) {
    element.textContent = content;
}
