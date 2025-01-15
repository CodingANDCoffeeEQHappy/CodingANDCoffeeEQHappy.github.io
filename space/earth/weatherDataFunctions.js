/*
CodingANDCoffeeEQHappy
Version 1.6.0
This file contains functions to handle the weather data from the OpenWeatherMap API.
*/
export async function parseWeatherData(citySpriteObj, units) {
    let jsonWeatherDataResponse, jsonWeatherDataUpdateTimeResponse;
    const cityUserData = citySpriteObj.userData;

    // The following function uses DOMPurify to sanitize inputs:
    const sanitizeData = (data) => {
        // If data is of type string, directly sanitize:
        if (typeof data === "string") {
            return DOMPurify.sanitize(data);

        } else if (Array.isArray(data)) {
            // If data is of type array, iterate through and sanitize each element:
            return data.map(ele => sanitizeData(ele));

        } else if (typeof data === "object" && data !== null) {
            // If data is of type object and contains data, iterate through each key 
            // and sanitize the data:
            const sanitizedObject = {};

            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    sanitizedObject[key] = sanitizeData(data[key]);
                }
            }

            return sanitizedObject;

        } else {
            // Else, return the data (will include numbers):
            return data;

        }
    };

    try {
        if (units === "F") {
            jsonWeatherDataResponse = await fetch(`./assets/data/weather_data/${cityUserData.id}_forecast_F.json`);
        } else {
            jsonWeatherDataResponse = await fetch(`./assets/data/weather_data/${cityUserData.id}_forecast_C.json`);
        }

        if (!jsonWeatherDataResponse.ok) {
            throw new Error("JSON Fetch Error");
        }

        // Read data as JSON:
        let response = await jsonWeatherDataResponse.json();

        // Sanitize the inputs:
        response = sanitizeData(response);

        // Get the weather update time from a JSON file:
        jsonWeatherDataUpdateTimeResponse = await fetch(`./assets/data/weather_data/${cityUserData.id}_forecast_update_time.json`);

        if (!jsonWeatherDataUpdateTimeResponse.ok) {
            throw new Error("JSON Fetch Error");
        }

        // Read data as JSON:
        let timeUpdateResponse = await jsonWeatherDataUpdateTimeResponse.json();
        
        // Sanitize the inputs:
        timeUpdateResponse = sanitizeData(timeUpdateResponse);

        return {success: true, response, timeUpdateResponse};
    
    } catch (error) {
        console.log('JSON Fetch Error: ', error);
        return {success: false};
    }
}