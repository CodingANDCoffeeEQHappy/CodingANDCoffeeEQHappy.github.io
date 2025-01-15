/*
CodingANDCoffeeEQHappy
Version 1.6.0
This file contains the code for the Earth and related functions.
*/
import * as THREE from '../packages/threeJS/build/three.module.js';
import * as UTIL_FUNCTIONS from '../js/util.js';
import * as CONSTANTS from '../js/constants.js';
import * as GEOSPATIAL_FUNCTIONS from './geospatialFunctions.js';

// I used help from generative AI and a few articles linked within the code to properly write the following function:
export function calculateEarthsRotation() {
    // Get current date:
    const now = new Date();

    // Get the current Coordinated Universal Time: https://www.time.gov/
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();

    // https://astro.dur.ac.uk/~ams/users/lst.html#
    // Calculate how much of the current day has passed based on above times:
    const fractionOfDay = (hours + (minutes / 60) + (seconds / 3600)) / 24;

    // Convert this value to radians (Earth will spin 2PI per day):
    const earthRotation = fractionOfDay * (2 * Math.PI);

    return earthRotation;
}

// I used the help of generative AI and the resources linked below to write this function:
// https://science.nasa.gov/solar-system/orbits-and-keplers-laws/
export function createEarthOrbit() {
    // Used to find information for Earths orbit: https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
    const semiMajorAxis = CONSTANTS.AU_UNITS; // 1 AU -> converted to 234,868.657 units as the simulated Earths radius is 10 units. (https://ssd.jpl.nasa.gov/glossary/semimajor_axis.html)
    const eccentricity = CONSTANTS.EARTH_ECCENTRICITY; // https://ssd.jpl.nasa.gov/glossary/eccentricity.html
    const orbitalPeriod = CONSTANTS.EARTH_ORBITAL_PERIOD; // Earths orbital period in days (one Earth year).

    // Calculate time in days:
    // Time in milliseconds elapsed since midnight, January 1, 1970, convert to seconds, convert to minutes, hours, days % number of days per year:
    const timeInDays = (Date.now() / 1000 / 60 / 60 / 24) % orbitalPeriod; // Calculates the number of days passed in current year.

    // https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion#Position_as_a_function_of_time
    // Step 1) Mean Anomaly -> M = nt where n = 2 PI / T (https://en.wikipedia.org/wiki/Mean_anomaly)
    const meanAnomaly = (2 * Math.PI / orbitalPeriod) * timeInDays;

    // Step 2) True Anomaly -> Let e be the Orbital eccentricity. (https://en.wikipedia.org/wiki/True_anomaly)
    // An approximation of this value can be: v = M + 2 * e - 0.25 * e^3) * sin(M)
    const trueAnomaly = meanAnomaly + (2 * eccentricity - 0.25 * Math.pow(eccentricity, 3)) * Math.sin(meanAnomaly);

    // Step 3) Distance from the sun -> r = a * (1 - e^2) / 1 + e * cos(v) (https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion#Distance,_r)
    const distanceFromSun = semiMajorAxis * (1 - Math.pow(eccentricity, 2)) / (1 + eccentricity * Math.cos(trueAnomaly));

    // Return values so they can be applied to the Earths position:
    return {trueAnomaly, distanceFromSun};
}

/*
To create an accurate looking Earth model, I used this amazing article linked below. 
This article gives an amazing explanation of the code and techniques used here and you should check it out.
The following code to create the Earth model can be found in this article.
https://franky-arkon-digital.medium.com/make-your-own-earth-in-three-js-8b875e281b1e
*/
export async function createEarthMesh(scene) {
    // https://threejs.org/docs/#api/en/objects/Group
    const earthObjects = new THREE.Group();

    // Create the Earths atmosphere:
    const atmosGeometry = new THREE.SphereGeometry(10.1, 64, 64);
    const atmosMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            // https://franky-arkon-digital.medium.com/make-your-own-earth-in-three-js-8b875e281b1e
            // https://github.com/franky-adl/threejs-earth/blob/main/src/shaders/vertex.glsl
            varying vec3 vNormal;
            varying vec3 eyeVector;

            void main() {
                vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
                vNormal = normalize(normalMatrix * normal);
                eyeVector = normalize(mvPos.xyz);
                gl_Position = projectionMatrix * mvPos;
            }
        `,
        fragmentShader: `
            // https://franky-arkon-digital.medium.com/make-your-own-earth-in-three-js-8b875e281b1e
            // https://github.com/franky-adl/threejs-earth/blob/main/src/shaders/fragment.glsl
            varying vec3 vNormal;
            varying vec3 eyeVector;
            const float atmOpacity = 0.5;
            const float atmPowFactor = 1.0;
            const float atmMultiplier = 9.5;

            void main() {
                float dotP = dot(vNormal, eyeVector);
                float factor = pow(dotP, atmPowFactor) * atmMultiplier;
                vec3 atmColor = vec3(0.35 + dotP/4.5, 0.35 + dotP/4.5, 1.0);
                gl_FragColor = vec4(atmColor, atmOpacity) * factor;
            }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    });

    const atmosMesh = new THREE.Mesh(atmosGeometry, atmosMaterial);

    // https://earthobservatory.nasa.gov/features/Milankovitch/milankovitch_2.php
    // https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
    const earthsAxialTiltDegress = CONSTANTS.EARTH_AXIAL_TILT; // -23.44 -> This is multiplied by -1 for proper coordinate system axes in Three.js.
    earthObjects.rotation.z = THREE.MathUtils.degToRad(earthsAxialTiltDegress); // Convert Earths tilt in degress to radians.
    
    // Load imagery for textures (imagery from NASA):
    // https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_8192.png
    const earthDayTimeMap = await UTIL_FUNCTIONS.loadTexures("./assets/images/earth/land_ocean_ice_8192.png");

    // https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/BlackMarble_2016_01deg.jpg
    const earthNightTimeMap = await UTIL_FUNCTIONS.loadTexures("./assets/images/earth/BlackMarble_2016_01deg.jpg");

    // Set the correct color space for the textures (https://threejs.org/docs/#manual/en/introduction/Color-management):
    earthDayTimeMap.colorSpace = THREE.SRGBColorSpace;
    earthNightTimeMap.colorSpace = THREE.SRGBColorSpace;

    // Load the bump map for Earth (https://en.wikipedia.org/wiki/Bump_mapping and https://docs.unity3d.com/Manual/StandardShaderMaterialParameterNormalMap.html):
    // https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73934/srtm_ramp2.worldx294x196.jpg
    const earthBumpMap = await UTIL_FUNCTIONS.loadTexures("./assets/images/earth/srtm_ramp2.worldx294x196.jpg");

    // Load the ocean texture (https://svs.gsfc.nasa.gov/3487):
    // https://svs.gsfc.nasa.gov/vis/a000000/a003400/a003487/landmask4K.png
    const earthOceanMap = await UTIL_FUNCTIONS.loadTexures("./assets/images/earth/landmask4K.png");

    // Create the Earth material:
    const earthMaterial = new THREE.MeshStandardMaterial({
        map: earthDayTimeMap, 
        bumpMap:  earthBumpMap,
        bumpScale: 0.03,
        roughnessMap: earthOceanMap,
        metalnessMap: earthOceanMap,
        metalness: 0.1,
        emissiveMap: earthNightTimeMap,
        emissive: new THREE.Color(0xffff88)
    });

    // Create the Earth geom. and mesh:
    const earthGeometry = new THREE.SphereGeometry(CONSTANTS.EARTH_RADIUS, 64, 64); // Radius = 10 units
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    
    // Create the cloud layer:
    // https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg
    const cloudsMap = await UTIL_FUNCTIONS.loadTexures("./assets/images/earth/cloud_combined_2048.jpg");

    const cloudsMaterial = new THREE.MeshStandardMaterial({
        alphaMap: cloudsMap,
        transparent: true
    });

    // Create the cloud mesh:
    const cloudsGeometry = new THREE.SphereGeometry(10.05, 64, 64);
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);

    // Update the shader used for the Earth material:
    // Resources that I used to learn more about shaders:
    // https://www.khronos.org/opengl/wiki/Shader
    // https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_on_the_web/GLSL_Shaders
    earthMaterial.onBeforeCompile = function(shader) {
        shader.uniforms.tClouds = { value: cloudsMap };
        shader.uniforms.tClouds.value.wrapS = THREE.RepeatWrapping;
        shader.uniforms.uv_xOffset = { value: 0 };
        
        shader.fragmentShader = shader.fragmentShader.replace('#include <common>', `
            #include <common>
            uniform sampler2D tClouds; // Stores texture of the clouds.
            uniform float uv_xOffset; // Offset for ensuring the cloud shadow position is correct.
        `);

        // Casts cloud shadows:
        shader.fragmentShader = shader.fragmentShader.replace('#include <emissivemap_fragment>', `
            #include <emissivemap_fragment>
            float cloudsMapValue = texture2D(tClouds, vec2(vMapUv.x - uv_xOffset, vMapUv.y)).r;
            diffuseColor.rgb *= max(1.0 - cloudsMapValue, 0.2);
        `);

        // Gives the ocean a more reflective look:
        shader.fragmentShader = shader.fragmentShader.replace('#include <roughnessmap_fragment>', `
            float roughnessFactor = roughness;
    
            #ifdef USE_ROUGHNESSMAP
    
            vec4 texelRoughness = texture2D(roughnessMap, vRoughnessMapUv);
            texelRoughness = vec4(1.0) - texelRoughness;
            roughnessFactor *= clamp(texelRoughness.g, 0.5, 1.0);
    
            #endif
        `);

        // Allow the light from the sun to affect which map is used on Earth:
        shader.fragmentShader = shader.fragmentShader.replace("#include <emissivemap_fragment>", `
            #ifdef USE_EMISSIVEMAP
                vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
                
                emissiveColor *= 1.0 - smoothstep(-0.02, 0.0, dot(normalize(vNormal), directionalLights[0].direction));
                totalEmissiveRadiance *= emissiveColor.rgb;
            #endif

            float intensity = 1.4 - dot(normalize(vNormal), vec3(0.0, 0.0, 1.0));
            vec3 atmosphere = vec3(0.3, 0.6, 1.0) * pow(intensity, 5.0);
 
            diffuseColor.rgb += atmosphere;
        `);

        earthMaterial.userData.shader = shader;
    }

    atmosMesh.name = "earth_atmos";
    earthObjects.add(atmosMesh);
    cloudsMesh.name = "earth_clouds";
    earthObjects.add(cloudsMesh);
    earthMesh.name = "earth_surface";
    earthObjects.add(earthMesh);

    // Add cities to the Earth's surface:
    const cities = new THREE.Group();
    const cityLabels = new THREE.Group();

    GEOSPATIAL_FUNCTIONS.addCities().then(result => {
        // If the data is returned:
        if (result.success) {
            // Add the cities to the Earth mesh:
            result.citiesArr.forEach(element => {
                cities.add(element.marker);
                cityLabels.add(element.cityLabel);
            });

            cities.name = "earth_cities";
            earthObjects.add(cities);
            cityLabels.name = "earth_city_labels";
            earthObjects.add(cityLabels);
        }
    });
    
    scene.add(earthObjects);
    earthObjects.rotation.y = calculateEarthsRotation();
    
    // This is approx. 1 AU = ~149,597,870.7 km (https://cneos.jpl.nasa.gov/glossary/au.html)
    // 149,597,870.7 km * 0.00157 units per km = ~234,868.657 units
    earthObjects.position.set(CONSTANTS.AU_UNITS, 0, 0);

    return earthObjects;
}

// The following function adds a label above the Earth using a sprite:
export function addEarthLabel(earth) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const text = "Earth";

    const fontSize = 200;
    const dynamicCanvasSize = context.measureText(text);
    canvas.width = dynamicCanvasSize.width * 100; // Set the canvas width
    canvas.height = fontSize; // Set the canvas height
    
    // Set the canvas styles:
    context.font = `${fontSize}px Monospace`;
    context.fillStyle = 'white';
    context.strokeStyle = 'black';
    context.lineWidth = 4;

    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillText(text, canvas.width / 2, canvas.height / 2);

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 100});
    const sprite = new THREE.Sprite(spriteMaterial); 
    sprite.position.set(earth.position.x, earth.position.y + 15, earth.position.z); // Offset the sprite above the Earth.
    sprite.scale.set(canvas.width / 50, canvas.height / 50, 1);
    sprite.name = "earth_label";

    spriteMaterial.depthTest = false;

    // Add data to the sprite for later use:
    sprite.userData = {
        "id": "earth",
        "city": "Earth",
        "country": "Solar System",
        "cityCountryNativeLang": "",
        "latitude": 0,
        "longitude": 0,
        "cityWikiURL": "https://science.nasa.gov/earth/facts/",
        "countryWikiURL": "https://science.nasa.gov/solar-system/",
        "timeZoneID": "UTC"
    };

    /*
    A group is used here as the sprite animation code I wrote for cities
    works with Three.js groups rather than individual objects.
    */
    const earthLabelGroup = new THREE.Group();
    earthLabelGroup.add(sprite);

    return earthLabelGroup;
}