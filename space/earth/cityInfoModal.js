/*
CodingANDCoffeeEQHappy
Version 1.6.0
This file controls the modal buttons and text for each city.
*/
import * as WEATHER_DATA_FUNCTIONS from './weatherDataFunctions.js';
import * as CONSTANTS from '../js/constants.js';
import * as CAMERA_AUTO_ROTATE from '../js/cameraAutoRotate.js';

function capitalizeText(text) {
    return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// This function is used as a callback to update the date and time in the modal:
function updateDateTime(cityDate, cityTime, cityUserData) {
    const dateFormatter = new Intl.DateTimeFormat('en-US', { 
        timeZone: cityUserData.timeZoneID,
        dateStyle: 'full',
    });
    
    const timeFormatter = new Intl.DateTimeFormat('en-US', { 
        timeZone: cityUserData.timeZoneID,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    cityDate.textContent = `${dateFormatter.format(new Date())}`;
    cityTime.textContent = `${timeFormatter.format(new Date())}`;
}

// The following displays the weather data in the modal:
function displayWeatherData(citySpriteObj, units) {
    // Get the weather data elements:
    const weatherDataIcon = document.getElementById("weatherDataIcon");
    const weatherDataTemp = document.getElementById("weatherDataTemp");
    const weatherDataTempMin = document.getElementById("weatherDataTempMin");
    const weatherDataTempMax = document.getElementById("weatherDataTempMax");
    const weatherDataDescription = document.getElementById("weatherDataDescription");

    // Weather prediction data:
    const futureWeatherDataDate1 = document.getElementById("futureWeatherDataDate1");
    const futureWeatherDataDate2 = document.getElementById("futureWeatherDataDate2");
    const futureWeatherDataDate3 = document.getElementById("futureWeatherDataDate3");
    const futureWeatherDataDate4 = document.getElementById("futureWeatherDataDate4");

    const futureWeatherDataMain1 = document.getElementById("futureWeatherDataMain1");  
    const futureWeatherDataTemp1 = document.getElementById("futureWeatherDataTemp1");
    const futureWeatherDataMain2 = document.getElementById("futureWeatherDataMain2");
    const futureWeatherDataTemp2 = document.getElementById("futureWeatherDataTemp2");
    const futureWeatherDataMain3 = document.getElementById("futureWeatherDataMain3");
    const futureWeatherDataTemp3 = document.getElementById("futureWeatherDataTemp3");
    const futureWeatherDataMain4 = document.getElementById("futureWeatherDataMain4");
    const futureWeatherDataTemp4 = document.getElementById("futureWeatherDataTemp4");

    const weatherDataLastUpdateTime = document.getElementById("weatherDataLastUpdateTime");

    // Get weather data:
    WEATHER_DATA_FUNCTIONS.parseWeatherData(citySpriteObj, units).then(result => {
        // If the data is returned:
        if (result.success) {
            // Update modal with weather data:
            // OpenWeatherMap weather icons: https://openweathermap.org/weather-conditions
            weatherDataIcon.src = `./assets/images/openweathermap_icons/${result.response.list[0].weather[0].icon}@2x.png`;
            weatherDataIcon.alt = "A weather icon from OpenWeatherMap to represent current weather conditions in this city.";
            weatherDataTemp.textContent = `${result.response.list[0].main.temp}℉`;
            weatherDataTempMin.textContent = `${result.response.list[0].main.temp_min}℉`;
            weatherDataTempMax.textContent = `${result.response.list[0].main.temp_max}℉`;
            weatherDataDescription.textContent = `${capitalizeText(result.response.list[0].weather[0].description)}`;

            // Get a list of unique dates from the JSON:
            let uniqueDates = [...new Set(result.response.list.map(obj => new Date((obj.dt) * 1000).toDateString()))];
            let uniqueIDs = [];
            let checkDatesForIndex = [];

            // Remove the current date:
            uniqueDates = uniqueDates.slice(1);

            // The following loop iterates through the weather JSON data and selects unique dates of future weather.
            // This ensures mutiple days are chosen instead of selecting the same date more than once.
            for (let i = 0; i < result.response.list.length; i++) {
                if (uniqueDates.includes(new Date((result.response.list[i].dt) * 1000).toDateString()) && !checkDatesForIndex.includes(new Date((result.response.list[i].dt) * 1000).toDateString())) {
                    uniqueIDs.push(i);
                    checkDatesForIndex.push(new Date((result.response.list[i].dt) * 1000).toDateString());
                }
            }

            // Weather prediction data:
            futureWeatherDataDate1.textContent = `${uniqueDates[0].replace(/\d{4}$/, '').trim()}`;
            futureWeatherDataDate2.textContent = `${uniqueDates[1].replace(/\d{4}$/, '').trim()}`;
            futureWeatherDataDate3.textContent = `${uniqueDates[2].replace(/\d{4}$/, '').trim()}`;
            futureWeatherDataDate4.textContent = `${uniqueDates[3].replace(/\d{4}$/, '').trim()}`;

            futureWeatherDataMain1.textContent = `${result.response.list[uniqueIDs[0]].weather[0].main}`;
            futureWeatherDataTemp1.textContent = `${result.response.list[uniqueIDs[0]].main.temp}℉`;

            futureWeatherDataMain2.textContent = `${result.response.list[uniqueIDs[1]].weather[0].main}`;
            futureWeatherDataTemp2.textContent = `${result.response.list[uniqueIDs[1]].main.temp}℉`;

            futureWeatherDataMain3.textContent = `${result.response.list[uniqueIDs[2]].weather[0].main}`;
            futureWeatherDataTemp3.textContent = `${result.response.list[uniqueIDs[2]].main.temp}℉`;

            futureWeatherDataMain4.textContent = `${result.response.list[uniqueIDs[3]].weather[0].main}`;
            futureWeatherDataTemp4.textContent = `${result.response.list[uniqueIDs[3]].main.temp}℉`;

            weatherDataLastUpdateTime.textContent = `${new Date(result.timeUpdateResponse.dateTime).toLocaleString()}`;
        } else {
            // Update modal with weather data fetch failure:
            // OpenWeatherMap weather icons: https://openweathermap.org/weather-conditions
            weatherDataIcon.src = "./assets/images/openweathermap_icons/01d@2x.png";
            weatherDataIcon.alt = "A weather icon from OpenWeatherMap to represent current weather conditions in this city.";
            weatherDataTemp.textContent = "Weather Data Update Error";
            weatherDataTempMin.textContent = "";
            weatherDataTempMax.textContent = "";
            weatherDataDescription.textContent = "Weather Data Update Error";

            futureWeatherDataDate1.textContent = "";
            futureWeatherDataDate2.textContent = "";
            futureWeatherDataDate3.textContent = "";
            futureWeatherDataDate4.textContent = "";
            futureWeatherDataMain1.textContent = "";
            futureWeatherDataTemp1.textContent = "";
            futureWeatherDataMain2.textContent = "";
            futureWeatherDataTemp2.textContent = "";
            futureWeatherDataMain3.textContent = "";
            futureWeatherDataTemp3.textContent = "";
            futureWeatherDataMain4.textContent = "";
            futureWeatherDataTemp4.textContent = "";
            weatherDataLastUpdateTime.textContent = "";
        }
    });
}

// Instead of displaying weather data, if the entire Earth is selected, this data is displayed:
function displayDataEarth(citySpriteObj, earth, moon, sun) {
    // Get the weather data elements:
    const weatherDataIcon = document.getElementById("weatherDataIcon");
    const weatherDataTemp = document.getElementById("weatherDataTemp");
    const weatherDataTempMin = document.getElementById("weatherDataTempMin");
    const weatherDataTempMax = document.getElementById("weatherDataTempMax");
    const weatherDataDescription = document.getElementById("weatherDataDescription");

    // Weather prediction data:
    const futureWeatherDataDate1 = document.getElementById("futureWeatherDataDate1");
    const futureWeatherDataDate2 = document.getElementById("futureWeatherDataDate2");
    const futureWeatherDataDate3 = document.getElementById("futureWeatherDataDate3");
    const futureWeatherDataDate4 = document.getElementById("futureWeatherDataDate4");

    const futureWeatherDataMain1 = document.getElementById("futureWeatherDataMain1");  
    const futureWeatherDataTemp1 = document.getElementById("futureWeatherDataTemp1");
    const futureWeatherDataMain2 = document.getElementById("futureWeatherDataMain2");
    const futureWeatherDataTemp2 = document.getElementById("futureWeatherDataTemp2");
    const futureWeatherDataMain3 = document.getElementById("futureWeatherDataMain3");
    const futureWeatherDataTemp3 = document.getElementById("futureWeatherDataTemp3");
    const futureWeatherDataMain4 = document.getElementById("futureWeatherDataMain4");
    const futureWeatherDataTemp4 = document.getElementById("futureWeatherDataTemp4");

    const weatherDataLastUpdateTime = document.getElementById("weatherDataLastUpdateTime");
    
    // https://visibleearth.nasa.gov/images/57730/the-blue-marble-land-surface-ocean-color-and-sea-ice
    weatherDataIcon.src = "./assets/images/earth/land_ocean_ice_8192.png";
    weatherDataIcon.alt = "An image of Earth displayed in 2D from NASA's Blue Marble image collection.";

    // Display Earth's distance to the Moon in km:
    weatherDataTemp.textContent = `Current Distance to the Moon (Approx.): ${(earth.position.distanceTo(moon.position) / CONSTANTS.SCALE_FACTOR).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} km`;

    weatherDataTempMin.textContent = "";
    weatherDataTempMax.textContent = "";

    // Display Earth's distance to the Sun in km:
    weatherDataDescription.textContent = `Current Distance to the Sun (Approx.): ${(earth.position.distanceTo(sun.sunMesh.position) / CONSTANTS.SCALE_FACTOR).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} km`;

    // Use a simple callback to update the distance values on the modal (every second):
    const updateDistanceCallback = setInterval(() => {
        weatherDataTemp.textContent = `Current Distance to the Moon (Approx.): ${(earth.position.distanceTo(moon.position) / CONSTANTS.SCALE_FACTOR).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} km`;

        weatherDataDescription.textContent = `Current Distance to the Sun (Approx.): ${(earth.position.distanceTo(sun.sunMesh.position) / CONSTANTS.SCALE_FACTOR).toLocaleString('en-US', {
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2
        })} km`;
    }, 1000);

    futureWeatherDataDate1.textContent = "";
    futureWeatherDataDate2.textContent = "";
    futureWeatherDataDate3.textContent = "";
    futureWeatherDataDate4.textContent = "";
    futureWeatherDataMain1.textContent = "";
    futureWeatherDataTemp1.textContent = "";
    futureWeatherDataMain2.textContent = "";
    futureWeatherDataTemp2.textContent = "";
    futureWeatherDataMain3.textContent = "";
    futureWeatherDataTemp3.textContent = "";
    futureWeatherDataMain4.textContent = "";
    futureWeatherDataTemp4.textContent = "";
    weatherDataLastUpdateTime.textContent = "N/A";

    return updateDistanceCallback;
}

// The following handles the opening/closing of the city modals:
export function openCityInfoModal(citySpriteObj, earth, moon, sun) {
    // Set var. so camera does not auto rotate while modal is open:
    CAMERA_AUTO_ROTATE.setDialogOpen(true);

    // Set the cursor to default:
    document.body.style.cursor = 'default';

    // Get the modals buttons, dialog element, and overlay:
    const closeModalButton = document.getElementById("closeModalButton");
    const dialog = document.getElementById("cityInfoModal");
    const overlay = document.getElementById("overlay");

    // Get the modal header and paragraph elements:
    const cityCountryName = document.getElementById("modalHeader");
    const cityCountryNameNativeLang = document.getElementById("modalHeaderSmaller");
    const cityLatLong = document.getElementById("cityLatLong");
    const cityDate = document.getElementById("cityDate");
    const cityTime = document.getElementById("cityTime");
    const moreInfoCity = document.getElementById("moreInfoCity");
    const moreInfoCountry = document.getElementById("moreInfoCountry");

    // Enable close button:
    closeModalButton.disabled = false;

    // Show the overlay and update the display style for the modal:
    overlay.style.display = 'block';
    dialog.style.display = 'flex';

    /*
    The following 'offsetHeight' forces the browser to notice the change between 
    the inital display and opacity styles and the updated styles that follow:
    */
    dialog.offsetHeight;
    dialog.style.opacity = '1';

    // Add data to the modal based on the city that was selected:
    const cityUserData = citySpriteObj.userData;

    // Update the city name, country, and city name/country in the city's/country's native language:
    cityCountryName.textContent = `${cityUserData.city}, ${cityUserData.country}`;
    cityCountryNameNativeLang.textContent = `${cityUserData.cityCountryNativeLang}`;

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
    // https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
    // Sets date format: 
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: cityUserData.timeZoneID,
        dateStyle: 'full',
    });

    // Sets time format:
    const timeFormatter = new Intl.DateTimeFormat('en-US', { 
        timeZone: cityUserData.timeZoneID,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });

    cityDate.textContent = `${dateFormatter.format(new Date())}`;
    cityTime.textContent = `${timeFormatter.format(new Date())}`;
    
    // Update the date and time every second:
    const updateDateTimeCallback = setInterval(() => updateDateTime(cityDate, cityTime, cityUserData), 1000);

    // Add text to more info sections:
    moreInfoCity.textContent = `${cityUserData.city}`;
    moreInfoCountry.textContent = `${cityUserData.country}`;

    // Add links to more info sections:
    moreInfoCity.href = `${cityUserData.cityWikiURL}`;
    moreInfoCountry.href = `${cityUserData.countryWikiURL}`;

    // Display weather data:
    let updateDistanceCallback;

    // Since the Earth modal will display different kinds of data than the other modals, this check occurs:
    if (cityUserData.id !== "earth") {
        cityLatLong.textContent = `${cityUserData.latitude}°, ${cityUserData.longitude}°`;
        displayWeatherData(citySpriteObj, "F");
    } else {
        cityLatLong.textContent = "";
        updateDistanceCallback = displayDataEarth(citySpriteObj, earth, moon, sun);
    }

    // The following event handler closes the modal when the back button is clicked:
    closeModalButton.addEventListener("click", function() {
        // Set var. so camera can auto rotate:
        CAMERA_AUTO_ROTATE.setDialogOpen(false);

        // Disable close button:
        closeModalButton.disabled = true;

        // Reset the default styles for the modals opacity:
        dialog.style.opacity = '0';

        // Reset the y-axis scroll to 0 (prevents modal from opening with a y-axis scroll value > 0):
        dialog.scrollTop = 0;

        // Stop the date/time and distance callback:
        clearInterval(updateDateTimeCallback);
        clearInterval(updateDistanceCallback);

        // Use a timeout to remove the modal with a slow fade:
        setTimeout(() => {
            dialog.style.display = 'none';
            overlay.style.display = 'none';
        }, 1000);
    });
}