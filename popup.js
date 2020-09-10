const api = {
    weatherkey: "", //INSERT API KEY
    geocodekey: "", //INSERT API KEY
    geocodebase: "https://maps.googleapis.com/maps/api/geocode/json?latlng=",
    weatherbase: "https://api.openweathermap.org/data/2.5/",
}

/*const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery); */
getLocation();
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        console.error("Geolocation is not supported by this browser.");
     }
}

function showPosition(position) {
    const LAT = position.coords.latitude;
    const LONGT = position.coords.longitude;
    //console.log(LAT + "," + LONGT);
    reverseGeoCode(LAT, LONGT);
}

function reverseGeoCode(LAT, LONGT){
    fetch(`${api.geocodebase}${LAT},${LONGT}&key=${api.geocodekey}`)
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        let city;
        let country;
        let subcity;
        let address;
        let parts = data.results[0].address_components;
        parts.forEach(part => {
            if(part.types.includes("country")){
                country = part.short_name;
            }
            if(part.types.includes("locality")){
                city = part.long_name;
            }
            if(part.types.includes("sublocality")){
                subcity = part.long_name;
            }
        })
        if(subcity != undefined){
            address = subcity + ", " + country;
        }
        else{
            address = city + ", " + country;
        }
        getResults(address);
    })
    .catch(err => console.warn(err.message));
}

/*function setQuery(evt){
    if (evt.keyCode == 13){
        getResults(searchbox.value);
        //console.log(searchbox.value);
    }
} */

function getResults(query){
    fetch(`${api.weatherbase}weather?q=${query}&units=metric&APPID=${api.weatherkey}`)
    .then(weather => {
        return weather.json();
    }).then(displayResults);
}

function displayResults(weather){
    //console.log(weather);
    let city = document.querySelector('.location .city');
    city.innerText = `${weather.name}, ${weather.sys.country}`;

    
    let utcSec = weather.dt + weather.timezone;
    let localtime = new Date(0);
    localtime.setUTCSeconds(utcSec);
    //console.log(localtime);
    let date = document.querySelector('.location .date');
    date.innerText = dateBuilder(localtime);

    let temp = document.querySelector('.current .temp');
    temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;

    let weather_el = document.querySelector('.current .weather');
    weather_el.innerText = weather.weather[0].main;

    let hilow = document.querySelector('.hi-low');
    hilow.innerText = `${Math.round(weather.main.temp_max)}°↑ • ${Math.round(weather.main.temp_min)}°↓`;

    let feelslike = document.querySelector('.current .feelslike');
    feelslike.innerHTML = `Feels like: ${Math.round(weather.main.feels_like)}<span>°C</span>`;
}

function dateBuilder(d){
    let months = ["January", "February", "March", "April",
    "May", "June", "July", "August", "September", "October",
    "November", "December"];

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", 
    "Friday","Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${month} ${date} ${year}`;
}