/*
CodingANDCoffeeEQHappy
Version 1.6.0
This file contains functions that work with objects on the Earth's surface.
*/
import * as THREE from '../packages/threeJS/build/three.module.js';
import * as CONSTANTS from '../js/constants.js';

// The following converts points of lat, long into Cartesian points:
export function latLongToCartesian(lat, long) {
    // Convert Lat, Long (degrees) to Radians:
    const phi = (90 - lat) * (Math.PI / 180); // 90 - lat ensures the value is 0-180.
    const theta = (long + 180) * (Math.PI / 180); // long + 180 ensures the value is 0-360.

    // https://www.mathworks.com/help/symbolic/transform-spherical-coordinates-and-plot.html
    /* 
    x = -(radius * sin(phi) * cos(theta))
    Note: The negation in the following is used to properly align the location in Three.js's 
    coordinate system.
    */
    let x = -(CONSTANTS.EARTH_REAL_RADIUS * Math.sin(phi) * Math.cos(theta));

    // y = radius * cos(phi)
    let y = CONSTANTS.EARTH_REAL_RADIUS * Math.cos(phi);

    // z = radius * sin(theta) * sin(theta)
    let z = CONSTANTS.EARTH_REAL_RADIUS * Math.sin(phi) * Math.sin(theta);

    // Scale coords to the simulated scale:
    x = x * CONSTANTS.SCALE_FACTOR;
    y = y * CONSTANTS.SCALE_FACTOR;
    z = z * CONSTANTS.SCALE_FACTOR;
    
    return {x, y, z};
}

// The following function creates sprites for each city on Earth:
export function createSprite(object, text, jsonData) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    const fontSize = 12;
    const dynamicCanvasSize = context.measureText(text);
    canvas.width = dynamicCanvasSize.width * 3.3; // Set the canvas width
    canvas.height = fontSize; // Set the canvas height
    
    // Set the canvas styles:
    context.font = `${fontSize}px Monospace`;
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.lineWidth = 4;

    // As a few cities are close together, this label change makes it easier to read/click:
    if (jsonData.id === "bern" || jsonData.id === "gaza_city") {
        context.textAlign = 'left';
        context.textBaseline = 'middle';
    } else {
        context.textAlign = 'right';
        context.textBaseline = 'middle';
    }
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0});
    const sprite = new THREE.Sprite(spriteMaterial); 
    sprite.position.set(object.position.x, object.position.y + 0.5, object.position.z);
    sprite.scale.set(canvas.width / 50, canvas.height / 50, 1);

    spriteMaterial.depthTest = false;

    // Add data to the sprite for later use:
    sprite.userData = {
        "id": jsonData.id,
        "city": jsonData.city,
        "country": jsonData.country,
        "cityCountryNativeLang": jsonData.cityCountryNativeLang,
        "latitude": jsonData.latitude,
        "longitude": jsonData.longitude,
        "cityWikiURL": jsonData.cityWikiURL,
        "countryWikiURL": jsonData.countryWikiURL,
        "timeZoneID": jsonData.timeZoneID
    };

    return sprite;
}

/*
https://docs.unity3d.com/Manual/UnderstandingFrustum.html
https://threejs.org/docs/#api/en/math/Frustum
The following function creates a custom frustum to determine what objects the camera is looking at.
While the default frustum can be used, a custom one helped with adding/removing objects
as they moved in/out of the cameras view.
*/
function createCustomFrustum(camera, smallerFOV = camera.fov - 10, near = 0.1, far = 10) {
    // Set the aspect ratio:
    const aspect = camera.aspect;

    // Make the FOV to be slightly smaller than the default camera:
    const smallerFOVRadians = THREE.MathUtils.degToRad(smallerFOV);
    const tanHalfFOV = Math.tan(smallerFOVRadians / 2);

    // Calculate the planes:
    const top = near * tanHalfFOV;
    const bottom = -top;
    const right = top * aspect;
    const left = -right;

    // Create the frustum:
    const frustum = new THREE.Frustum();
    const projectionMatrix = new THREE.Matrix4();
    projectionMatrix.makePerspective(left, right, top, bottom, near, far);
    
    // Multiply by the camera's world matrix to align the frustum with camera's view:
    const viewMatrix = new THREE.Matrix4().copy(camera.matrixWorld).invert();
    const customViewProjectionMatrix = new THREE.Matrix4().multiplyMatrices(projectionMatrix, viewMatrix);
    frustum.setFromProjectionMatrix(customViewProjectionMatrix);

    return frustum;
}

// The following function updates each labels visibility based on whether or not the city is visible in the frame:
export function updateMarkerVisibility(earthSpriteLayer, earthLabelGroup, camera, earthCameraControls) {
    if (typeof earthSpriteLayer !== 'undefined') {
        // Get smaller camera frustum:
        const cityFrustum = createCustomFrustum(camera);
        
        // Get the cameras zoom level:
        const zoomLevel = camera.position.distanceTo(earthCameraControls.target);
        let earthLabelFrustum;

        // For different zoom levels, the frustum checking the Earth label changes its far view distance:
        if (zoomLevel >= 47) {
            earthLabelFrustum = createCustomFrustum(camera, camera.fov + 10, 0.1, 23);
        } else if (zoomLevel >= 34) {
            earthLabelFrustum = createCustomFrustum(camera, camera.fov + 10, 0.1, 8);
        } else {
            earthLabelFrustum = createCustomFrustum(camera, camera.fov + 10, 0.1, 0.3);
        }

        // Update camera:
        camera.updateMatrixWorld();

        // Check if each sprite is within the frustum:
        earthSpriteLayer.children.forEach((sprite) => {
            // If the sprite can be seen within the frustum, display the sprite:
            if (cityFrustum.intersectsObject(sprite)) {
                sprite.material.visible = true;

            } else {
                sprite.material.visible = false;
                
            }
        });

        // Check if the Earth label is within the frustum:
        earthLabelGroup.children.forEach((sprite) => {
            // If the sprite can be seen within the frustum, display the sprite:
            if (earthLabelFrustum.intersectsObject(sprite)) {
                sprite.material.visible = true;

            } else {
                sprite.material.visible = false;
                
            }
        });
    }
}

// The following function adds cities to the Earths surface:
export async function addCities() {
    // Array used to store the city meshes (a sphere for each city):
    let citiesArr = [];

    // Attempt to read the data from the JSON file:
    try {
        const jsonResponse = await fetch("./assets/data/cities.json");

        if (!jsonResponse.ok) {
            throw new Error("JSON Fetch Error");
        }

        const response = await jsonResponse.json();
        const jsonDataArr = response.cities;

        // Create the city mesh for each location and add to the city array:
        jsonDataArr.forEach(element => {
            // Simple input validation to ensure the returned JSON data is valid:
            if (typeof element.id === "string" && typeof element.city === "string" && typeof element.country === "string" && typeof element.cityCountryNativeLang === "string" && typeof element.latitude === "number" && typeof element.longitude === "number" && typeof element.cityWikiURL === "string" && typeof element.countryWikiURL === "string" && typeof element.timeZoneID === "string") {
                // Simple function to check if URLs are valid:
                const isValidURL = (urlStr) => {
                    try {
                        new URL(urlStr);
                        return true;
                    } catch (e) {
                        return false;
                    }
                };

                // Create the city mesh and add the data for each city:
                if (isValidURL(element.cityWikiURL) && isValidURL(element.countryWikiURL)) {
                    const markerGeometry = new THREE.SphereGeometry(0.1, 32, 32);
                    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0});
                    const marker = new THREE.Mesh(markerGeometry, markerMaterial);

                    const cityPosition = latLongToCartesian(element.latitude, element.longitude);
                    marker.position.set(cityPosition.x, cityPosition.y, cityPosition.z);
                    marker.name = `${element.id}`;

                    // Add data to the marker for later use:
                    marker.userData = {
                        "id": element.id,
                        "city": element.city,
                        "country": element.country,
                        "cityCountryNativeLang": element.cityCountryNativeLang,
                        "latitude": element.latitude,
                        "longitude": element.longitude,
                        "cityWikiURL": element.cityWikiURL,
                        "countryWikiURL": element.countryWikiURL,
                        "timeZoneID": element.timeZoneID
                    };

                    // Make city label:
                    const cityLabel = createSprite(marker, `${element.city}, ${element.country}`, element);
                    cityLabel.name = `${element.id}_label`;

                    citiesArr.push({marker, cityLabel});

                } else {
                    console.log("JSON Data Error: Returned URL in JSON Object is Invalid");
                }
            } else {
                console.log("JSON Data Type Error: Returned JSON Object has Unexpected Data Type");
            }
        });

        return {success: true, citiesArr};

    } catch (error) {
        console.log('JSON Fetch Error: ', error);
        return {success: false, citiesArr};
    }
}

// The following function updates each city to its correct location (prevents a bug):
export function updateCityLocations(earthCityLayer, earthCityLabelLayer) {
    // Update the city position:
    if (typeof earthCityLayer !== 'undefined') {
        earthCityLayer.children.forEach((city) => {
            const cityPosition = latLongToCartesian(city.userData.latitude, city.userData.longitude);
            city.position.set(cityPosition.x, cityPosition.y, cityPosition.z);
        });
    }

    // Update the sprite position:
    if (typeof earthCityLabelLayer !== 'undefined') {
        earthCityLabelLayer.children.forEach((sprite) => {
            const cityPosition = latLongToCartesian(sprite.userData.latitude, sprite.userData.longitude);
            sprite.position.set(cityPosition.x, cityPosition.y + 0.5, cityPosition.z);
        });
    }
}