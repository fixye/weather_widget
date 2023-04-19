import "./style.css";
import key from "./key.js";
import { View } from "./View.js";


const urlDefault = `https://api.openweathermap.org/data/2.5/weather?lat=50.1424&lon=15.1188&appid=${key}`;
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
const view = new View();

async function getWeatherData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

getWeatherData(urlDefault).then((data) => {
    content(data);
});


// Feeding elements in the component from the API data
function content(data) {
    // JSON object destructuring
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

    view.date.innerHTML = `${months[date.getMonth()]} ${date.getDate()}`;
    view.day.innerHTML = days[date.getDay()];
    view.actualTemp.innerHTML = `${actualTempCelc}`;
    view.feelsLike.innerHTML = `${feelsLikeTempCelc}`;
    view.icon.src = `https://openweathermap.org/img/wn/${currentWeatherIcon}@2x.png`;
    view.name.innerHTML = `${name} ${data.sys.country}`;
    view.arrow.style.cssText = `
        transform-origin: 50% 50%;
        transform: rotate(${90 + windDeg}deg) scale(.4);
    }
    `;
    view.windSpeed.innerHTML = `${windSpeed} m/s`;
    view.gustsSpeed.innerHTML = `${windGusts} m/s`;
}

// Event listener to close suggestions when clicked anywhere else
// in the document
document.addEventListener('click', function(e) {
    if (!(e.target.classList.contains('search-bar'))) 
        view.suggestionsList.innerHTML = ''
})


searchBar.addEventListener("input", function () {
    if (view.searchBar.value.length > 2)
        querySearch(view.searchBar.value);
});

// Function that handles search bar event listener
// Calls api with a query and returns list items which
// are fed to the suggestions unordered list
function querySearch(value) {
    clearTimeout(debounce);

    if(!value){
        suggestionsList.innerHTML = ''
        return
    }

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
                if (data && data.list) {
                    suggestionsList.innerHTML = "";
                    data.list.forEach((item, event) => {
                        const li = document.createElement("li");
                        li.textContent = `${item.name}, ${item.sys.country}`;
                        li.classList.add('query-item')
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
                    updateListHeight(data.count);
                } else {
                    view.suggestionsList.style.display = 'none'
                    return;
                }
            })
            .then((data) => {
                if(data && data.errorMessage) {
                    console.log('third then')
                    throw new Error (data.errorMessage)
                }
                return data
            })
            .catch((error) => {
                console.log('catch block')
                console.log(error.message);
            })
    }, 500);
}

// Function that calculates the number of suggestions
// and adjusts the height of the list.
// (also adds scrollbar when suggestions return more then 10 items)
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
