export class View {
    constructor() {
        this.searchBar = document.querySelector(".search-bar");
        this.suggestionsList = document.querySelector(".suggestions");
        this.date = document.querySelector(".date");
        this.day = document.querySelector(".day");
        this.actualTemp = document.querySelector(".big-number");
        this.feelsLike = document.querySelector("#fl");
        this.cityName = document.querySelector(".name");
        this.windArrow = document.querySelector(".arrow");
        this.windSpeed = document.querySelector(".wind-speed");
        this.gustsSpeed = document.querySelector(".gusts-speed");
        this.icon = document.querySelector('.icon')
        this.arrow = document.querySelector('.arrow')
        this.name = document.querySelector('.name')
    }
}
