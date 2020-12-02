const API_KEY = "98f42c2039f0a6e84dc1b79728b40e78";

// load default weather when page loads
window.addEventListener('load', (event) => {
    loadDefaultWeather();
});

// search button
document.getElementById("search-button").addEventListener('click', (event) => {
    searchWeather();
});

// set default button
document.getElementById("set-default-button").addEventListener('click', (event) => {
    setDefaultWeather();
})

// loads default weather
async function loadDefaultWeather() {
    // attempt to load defaults from local storage
    let cityName = window.localStorage.getItem("cityName");
    let stateName = window.localStorage.getItem("stateName");

    // if no default, use LA
    if(!cityName) cityName = 'Los Angeles';
    if(!stateName) stateName = 'CA';

    // get data
    const data = await getWeatherData(cityName, stateName);

    // update city name (must be done here because api does not return state name)
    document.getElementById("results-city-name").innerHTML = data.name;
    document.getElementById("results-state-name").innerHTML = stateName;

    // update weather data
    updateWeather(data);
}

// set default city
function setDefaultWeather() {
    // take city and state from results
    window.localStorage.setItem("cityName", document.getElementById("results-city-name").innerText);
    window.localStorage.setItem("stateName", document.getElementById("results-state-name").innerText);
}

// get weather for city
async function searchWeather() {
    // get city and state from input
    const cityName = document.getElementById("city-search").value;
    const stateName = document.getElementById("state-search").value;

    if(cityName) {
        if(stateName) {
            // get data
            const data = await getWeatherData(cityName, stateName);

            // update city name (must be done here because api does not return state name)
            document.getElementById("results-city-name").innerHTML = data.name;
            document.getElementById("results-state-name").innerHTML = stateName;

            // update weather data
            updateWeather(data);
        } else {
            // state required
        }
    } else {
        // city required
    }
    
}

// fetches weather data from open weather api
async function getWeatherData(cityName, stateCode) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName},${stateCode},US&units=imperial&appid=${API_KEY}`);
    const data = await response.json();

    console.log(data);
    return data;
}

// updates the dom with weather data
async function updateWeather(data) {
    function updateEl(id, newText) {
        document.getElementById(id).innerHTML = newText;
    }

    document.getElementById("results-icon").setAttribute("src", `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`);
    document.getElementById("results-icon").setAttribute("alt", data.weather[0].description);
    updateEl("results-weather", data.weather[0].main);
    updateEl("results-temperature", data.main.temp + " °F");
    updateEl("results-feels-like", data.main.feels_like + " °F");
    updateEl("results-high", data.main.temp_max + " °F");
    updateEl("results-low", data.main.temp_min + " °F");
    updateEl("results-humidity", data.main.humidity + "%");
    updateEl("results-pressure", (data.main.pressure*0.02953).toFixed(2));
}

