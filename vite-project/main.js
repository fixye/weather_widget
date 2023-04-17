import "./style.css";
import key from "./key";

const url = `https://api.openweathermap.org/data/2.5/weather?lat=50.1424&lon=15.1188&appid=${key}`;
const iconUrl = `https://openweathermap.org/img/wn/{icon}@2x.png`;
const zeroK = 273.15;
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
let debounce = null;
const searchBar = document.querySelector(".search-bar");
const suggestionsList = document.querySelector(".suggestions");

const date = new Date();

async function getWeatherData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

getWeatherData(url).then((data) => {
    content(data);
});

function content(data) {
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
    const {
        weather: [{ icon: currentWeatherIcon }],
    } = data;
    const currentWeather = data.weather[0].main;
    const actualTempCelc = (actualTemp - zeroK).toFixed(0);
    const feelsLikeTempCelc = (feelsLikeTemp - zeroK).toFixed(0);
    feedContent(
        document.querySelector(".date"),
        `${months[date.getMonth()]} ${date.getDate()}`
    );
    feedContent(document.querySelector(".day"), days[date.getDay()]);
    feedContent(document.querySelector(".big-number"), `${actualTempCelc}`);
    feedContent(document.querySelector("#fl"), `${feelsLikeTempCelc}`);
    document.querySelector(
        ".icon"
    ).src = `https://openweathermap.org/img/wn/${currentWeatherIcon}@2x.png`;
    feedContent(document.querySelector(".name"), `${name} CZ`);
    document.querySelector(".arrow").style.cssText = `
        transform-origin: 50% 50%;
        transform: rotate(${90 + windDeg}deg) scale(.4);
    }
    `;
    feedContent(document.querySelector(".wind-speed"), `${windSpeed} m/s`);
    feedContent(document.querySelector(".gusts-speed"), `${windGusts} m/s`);
}

function feedContent(element, content) {
    element.textContent = content;
}

searchBar.addEventListener("input", function () {
    const value = searchBar.value;
    if (value) querySearch(value);
});

function querySearch(value) {
    clearTimeout(debounce);

    debounce = setTimeout(() => {
        fetch(
            `http://api.openweathermap.org/data/2.5/find?q=${value}&type=like&appid=${key}`
        )
            .then((response) => {
                if (response.ok) return response.json();
                else {
                    throw new Error("Bad request");
                }
            })
            .catch((error) => {
                console.log(error.message);
            })
            .then((data) => {
                if (data.list) {
                    suggestionsList.innerHTML = "";
                    data.list.forEach((item, event) => {
                        const li = document.createElement("li");
                        li.textContent = `${item.name}, ${item.sys.country}`;
                        suggestionsList.appendChild(li);

                        li.addEventListener("click", async () => {
                            searchBar.value = "";
                            suggestionsList.innerHTML = "";
                            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${item.coord.lat}&lon=${item.coord.lon}&appid=${key}`;
                            try {
                                getWeatherData(url).then((data) => {
                                    content(data);
                                });
                            } catch (error) {
                                console.log(error.message);
                            }
                        });
                    });
                    updateListHeight(data.list.length);
                } else {
                    return;
                }
            });
    }, 500);
}

function updateListHeight(suggestions) {
    const liHeight = 25;
    const maxSuggestions = 10;
    const numSuggestions = Math.min(suggestions, maxSuggestions);
    const listHeight = numSuggestions * liHeight;
    suggestionsList.style.height = `${listHeight + 5}px`;

    if (numSuggestions < maxSuggestions) {
        suggestionsList.style.overflowY = "hidden";
    } else {
        suggestionsList.style.overflowY = "auto";
    }
}

updateListHeight(5);
