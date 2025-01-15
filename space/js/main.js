/*
CodingANDCoffeeEQHappy
Version 1.6.0
This file sets up and controls the Three.js scene.
*/
import * as THREE from '../packages/threeJS/build/three.module.js';
import { OrbitControls } from '../packages/threeJS/examples/jsm/controls/OrbitControls.js';
import * as UTIL_FUNCTIONS from './util.js';
import * as LOADING_PAGE from './loadingPage.js';
import * as CAMERA_AUTO_ROTATE from './cameraAutoRotate.js';
import * as CONSTANTS from './constants.js';
import * as SUN from '../sun/sun.js';
import * as EARTH from '../earth/earth.js';
import * as EARTH_ANIMATIONS from '../earth/animateCities.js';
import * as EARTHS_MOON from '../earth/moon/moon.js';
import * as GEOSPATIAL_FUNCTIONS from '../earth/geospatialFunctions.js';
import * as ON_CLICK_CITY from '../earth/mouseEventHandlersEarth.js';

let scene, camera, renderer, currentCam, earth, sun, sunLight, orbitEarthCam, earthCameraControls, moonMesh;
let openMenuButton, moreInfoButton, aboutTheDevButton, playPauseMusicButton, mainMenu, moreInfo, footerText;
let earthLabelGroup, earthLabel;
const clock = new THREE.Clock();

function createScene() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

function onWindowResize() {
    currentCam.aspect = window.innerWidth / window.innerHeight;
    currentCam.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// The following function creates a camera that orbits the Earth:
export function createEarthCam() {
    const earthCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500000);
    earthCamera.position.set(30, 30, 30);

    earthCameraControls = new OrbitControls(earthCamera, renderer.domElement);
    earthCameraControls.enableDamping = true;
    earthCameraControls.dampingFactor = 0.25;
    earthCameraControls.enableZoom = true;
    earthCameraControls.enableRotate = true;
    earthCameraControls.enablePan = false;
    earthCameraControls.minDistance = 20;
    earthCameraControls.maxDistance = 50;
        
    return earthCamera;
}

/*
The following function checks the zoom level of the camera and displays cities on Earth
and removes UI when the camera's zoom is below a threshold:
*/
function checkOrbitZoomLevel(localCamera, layer) {
    const zoomThreshold = 25.0;
    const zoomLevel = localCamera.position.distanceTo(earthCameraControls.target);

    if (typeof layer !== 'undefined') {
        if (zoomLevel <= zoomThreshold) {
            // Show cities and sprites:
            EARTH_ANIMATIONS.fadeTo(layer, 1, 1000);

            // Remove menu button:
            openMenuButton.disabled = true;
            setTimeout(() => openMenuButton.classList.add("fade_text"), 200);
            setTimeout(() => footerText.classList.add("fade_text"), 200);
            setTimeout(() => {
                openMenuButton.classList.add("animate");
                EARTH_ANIMATIONS.fadeTo(earthLabelGroup, 0, 200);
            }, 500);
            
        } else {
            // Hide cities and sprites:
            EARTH_ANIMATIONS.fadeTo(layer, 0, 1000);
            
            // Show menu button:
            openMenuButton.disabled = false;
            setTimeout(() => openMenuButton.classList.remove("fade_text"), 500);
            setTimeout(() => footerText.classList.remove("fade_text"), 500);
            setTimeout(() => {
                openMenuButton.classList.remove("animate");
                EARTH_ANIMATIONS.fadeTo(earthLabelGroup, 1, 500);
            }, 500);
        }
    }
}

// The following opens the main menu when the button is clicked:
function openMainMenu() {
    // Set var. so camera does not auto rotate:
    CAMERA_AUTO_ROTATE.setDialogOpen(true);

    mainMenu.style.zIndex = 1000;
    setTimeout(() => mainMenu.classList.add("openMenu"), 200);

    const overlay = document.getElementById("overlay");
    const mainMenuButton1 = document.getElementById("mainMenuButton1");
    const mainMenuButton2 = document.getElementById("mainMenuButton2");
    const mainMenuButton3 = document.getElementById("mainMenuButton3");
    const mainMenuCloseButton = document.getElementById("mainMenuCloseButton");

    overlay.style.display = 'block';

    setTimeout(() => {
        mainMenuButton1.classList.add("displayButtons");
        mainMenuButton2.classList.add("displayButtons");
        mainMenuButton3.classList.add("displayButtons");
        mainMenuCloseButton.classList.add("displayButtons");

        mainMenuButton1.disabled = false;
        mainMenuButton2.disabled = false;
        mainMenuButton3.disabled = false;
        mainMenuCloseButton.disabled = false;
    }, 1600);

    // Close the menu when the close button is clicked:
    mainMenuCloseButton.addEventListener("click", () => {
        // Set var. so camera can auto rotate:
        CAMERA_AUTO_ROTATE.setDialogOpen(false);

        mainMenuButton1.disabled = true;
        mainMenuButton2.disabled = true;
        mainMenuButton3.disabled = true;
        mainMenuCloseButton.disabled = true;

        setTimeout(() => {
            mainMenuButton1.classList.remove("displayButtons");
            mainMenuButton2.classList.remove("displayButtons");
            mainMenuButton3.classList.remove("displayButtons");
            mainMenuCloseButton.classList.remove("displayButtons");
        }, 200);

        setTimeout(() => mainMenu.classList.remove("openMenu"), 1000);
        setTimeout(() => {
            mainMenu.style.zIndex = -1;
            overlay.style.display = 'none';
        }, 2550);
    });
}

// The following function opens the more info window when the "More Info" button is clicked:
function openMoreInfo() {
    moreInfo.style.zIndex = 1000;
    setTimeout(() => moreInfo.classList.add("openMenu"), 200);

    const overlay = document.getElementById("overlay");
    const moreInfoHeader = document.getElementById("moreInfoHeader");
    const moreInfoPara = document.getElementById("moreInfoPara");
    const moreInfoCloseButton = document.getElementById("moreInfoCloseButton");

    overlay.style.display = 'block';

    // Animate the elements on the page to appear:
    setTimeout(() => {
        moreInfoHeader.classList.add("animate");
        moreInfoPara.classList.add("animate");
        moreInfoCloseButton.classList.add("displayButtons");

        moreInfoCloseButton.disabled = false;
    }, 1600);

    // Closes the window when the close button is used:
    moreInfoCloseButton.addEventListener("click", () => {
        moreInfoCloseButton.disabled = true;

        setTimeout(() => {
            moreInfoHeader.classList.remove("animate");
            moreInfoPara.classList.remove("animate");
            moreInfoCloseButton.classList.remove("displayButtons");
        }, 200);

        setTimeout(() => moreInfo.classList.remove("openMenu"), 1000);
        setTimeout(() => {
            moreInfo.style.zIndex = -1;
        }, 2550);
    });
}

async function init() {
    createScene();
    
    // Add the background image (https://svs.gsfc.nasa.gov/3572/):
    // https://svs.gsfc.nasa.gov/vis/a000000/a003500/a003572/TychoSkymapII.t3_08192x04096.jpg
    const starMap = await UTIL_FUNCTIONS.loadTexures("./assets/images/space/TychoSkymapII.t3_08192x04096.jpg");
    LOADING_PAGE.incrementLoader(1 / 8); // Update the loading page.

    starMap.colorSpace = THREE.SRGBColorSpace;
    starMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = starMap;
    
    // Earth:
    earth = await EARTH.createEarthMesh(scene);
    LOADING_PAGE.incrementLoader(5 / 8); // Update the loading page.
    orbitEarthCam = createEarthCam();
    earthCameraControls.addEventListener('change', () => checkOrbitZoomLevel(orbitEarthCam, earth.children[3]));
    earthCameraControls.addEventListener('change', () => checkOrbitZoomLevel(orbitEarthCam, earth.children[4]));
    checkOrbitZoomLevel(orbitEarthCam, earth.children[3]);
    checkOrbitZoomLevel(orbitEarthCam, earth.children[4]);
    earthLabelGroup = EARTH.addEarthLabel(earth);
    earthLabel = earthLabelGroup.children[0];
    scene.add(earthLabelGroup);

    // Moon:
    moonMesh = await EARTHS_MOON.createMoon(scene);
    LOADING_PAGE.incrementLoader(2 / 8); // Update the loading page.

    // Sun:
    sun = SUN.createSunMesh(scene);
    scene.add(sun.sunsGlowMesh);
    scene.add(sun.sunMesh);
    sunLight = SUN.createSunLight(scene);

    // Setup a event listener for mouse clicks:
    renderer.domElement.addEventListener('click', (event) => {ON_CLICK_CITY.onClickCity(event, currentCam, scene, earth.children[4], earth, moonMesh, sun)}, false);
    renderer.domElement.addEventListener('mousemove', (event) => {ON_CLICK_CITY.onMouseMove(event, currentCam, scene, earth.children[4], earthLabelGroup)}, false);
}

function animate() {
    requestAnimationFrame(animate);

    // Use a deltaTime calculation similar to Unity's deltaTime: https://docs.unity3d.com/ScriptReference/Time-deltaTime.html
    const deltaTime = clock.getDelta();

    // Get Earth layers:
    const earthAtmos = earth.children[0];
    const earthClouds = earth.children[1];
    const earthSurface = earth.children[2];
    const earthCities = earth.children[3];
    const earthCityLabels = earth.children[4];
    
    // Rotate the Earth relative to time (makes the Earth rotate at CONSTANTS.EARTH_ROTATION_RATE radians per second):
    if (typeof earthCities !== "undefined" && typeof earthCityLabels !== "undefined") {
        earthSurface.rotation.y +=  (CONSTANTS.EARTH_ROTATION_RATE) * deltaTime;
        earthCities.rotation.y +=  (CONSTANTS.EARTH_ROTATION_RATE) * deltaTime;
        earthCityLabels.rotation.y +=  (CONSTANTS.EARTH_ROTATION_RATE) * deltaTime;
    }

    // Get the Earth material shader:
    const shader = earthSurface.material.userData.shader;

    // If the shader exists, update the clouds and cloud shadow rotation:
    if (shader) {
        earthClouds.rotation.y +=  (CONSTANTS.EARTH_ROTATION_RATE * 25) * deltaTime;
        shader.uniforms.uv_xOffset.value += (((CONSTANTS.EARTH_ROTATION_RATE * 25) * deltaTime) / (2 * Math.PI)) % 1;
    }

    // Orbit the Earth around the sun:
    const {trueAnomaly, distanceFromSun} = EARTH.createEarthOrbit();

    // Convert polar coordinates to Cartesian and apply these to the Earths position:
    earth.position.x = distanceFromSun * Math.cos(trueAnomaly);
    earth.position.z = distanceFromSun * Math.sin(trueAnomaly);

    // Update the Earths label to move with the Earth during its orbit:
    earthLabel.position.set(earth.position.x, earthLabel.position.y, earth.position.z);

    // Orbit the Moon around the Earth:
    const {moonOrbitRadius, moonOrbitPeriod, moonRotationSpeed, distance, moonTrueAnomaly} = EARTHS_MOON.createMoonOrbit(earth, moonMesh);
    
    // Rotate the Moon on its axis:
    moonMesh.rotation.y += moonRotationSpeed * deltaTime;

    // Update the suns light so it appears to point towards the Earth at all times:
    sunLight.target.position.set(earth.position.x, earth.position.y, earth.position.z);
    sunLight.target.updateMatrixWorld();

    // Very accurate current time in milliseconds (https://developer.mozilla.org/en-US/docs/Web/API/Performance/now):
    const currentTime = performance.now();

    // Check for Earth city animations:
    for (let i = 0; i < EARTH_ANIMATIONS.fadeAnimations.length; i++) {
        const anim = EARTH_ANIMATIONS.fadeAnimations[i]; // Current object to be animated.
        const elapsedTime = currentTime - anim.startTime;
        const progress = Math.min(elapsedTime / anim.duration, 1); // Progress for animation.

        // Set the material opacity to a new value to 'play' the fade animation:
        anim.mesh.material.opacity = anim.initialOpacity + (anim.targetOpacity - anim.initialOpacity) * progress;

        // Remove completed animation from array:
        if (progress >= 1) {
            EARTH_ANIMATIONS.fadeAnimations.splice(i, 1);
            i--;
        }
    }

    currentCam = orbitEarthCam;

    // The following updates the city labels visibility and city locations on Earth:
    GEOSPATIAL_FUNCTIONS.updateMarkerVisibility(earthCityLabels, earthLabelGroup, currentCam, earthCameraControls);
    GEOSPATIAL_FUNCTIONS.updateCityLocations(earthCities, earthCityLabels);

    // https://discourse.threejs.org/t/help-attaching-a-perspective-camera-with-orbit-controls-on-a-moving-object/68139/5
    orbitEarthCam.position.sub(earthCameraControls.target);
    earthCameraControls.target.copy(earth.position);
    orbitEarthCam.position.add(earthCameraControls.target);
    earthCameraControls.update();

    renderer.render(scene, currentCam);
}

window.addEventListener('load', function() { 
    document.body.classList.add('animate');
});

document.addEventListener("DOMContentLoaded", function() {
    mainMenu = document.getElementById("mainMenu");
    moreInfo = document.getElementById("moreInfo");
    mainMenu.style.zIndex = -1;
    moreInfo.style.zIndex = -1;
    openMenuButton = document.getElementById("openMenuButton");
    moreInfoButton = document.getElementById("mainMenuButton1");
    aboutTheDevButton = document.getElementById("mainMenuButton2");
    playPauseMusicButton = document.getElementById("mainMenuButton3");
    footerText = document.getElementById("footerText");

    window.addEventListener("resize", onWindowResize);
    openMenuButton.addEventListener("click", openMainMenu);
    moreInfoButton.addEventListener("click", openMoreInfo);
    aboutTheDevButton.addEventListener("click", () => window.open("../helloworld.html", "_blank"));
});

await init();
animate();

// Check for inputs to reset the auto-rotate for the camera:
['mousemove', 'mousedown', 'touchstart'].forEach(event => {
    window.addEventListener(event, () => CAMERA_AUTO_ROTATE.resetIdleTimer(earthCameraControls));
});

CAMERA_AUTO_ROTATE.resetIdleTimer(earthCameraControls);