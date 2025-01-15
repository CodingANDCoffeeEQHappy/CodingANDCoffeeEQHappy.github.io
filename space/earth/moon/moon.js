/*
CodingANDCoffeeEQHappy
Version 1.6.0
This file creates the Moon and contains other Moon related functions.
*/
import * as THREE from '../../packages/threeJS/build/three.module.js';
import * as UTIL_FUNCTIONS from '../../js/util.js';
import * as CONSTANTS from '../../js/constants.js';

export async function createMoon(scene) {
    // Load moon textures: https://svs.gsfc.nasa.gov/4720
    // https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_1k.jpg
    const moonMap = await UTIL_FUNCTIONS.loadTexures("./assets/images/moon/lroc_color_poles_1k.jpg");
    moonMap.colorSpace = THREE.SRGBColorSpace;

    // https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/ldem_3_8bit.jpg
    const moonDisplacementMap = await UTIL_FUNCTIONS.loadTexures("./assets/images/moon/ldem_3_8bit.jpg");

    // https://science.nasa.gov/moon/facts/
    // To create a proper radius of the Moon relative to Earth, the following can be used:
    // Earth's Radius * Scale Factor
    // 1,737.4 km * 0.00157 units/km = ~2.72 (https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html)
    const moonGeom = new THREE.SphereGeometry(CONSTANTS.EARTH_MOON_RADIUS, 64, 64);

    // Create the material for the Moon:
    const moonMat = new THREE.MeshStandardMaterial({
        map: moonMap,
        displacementMap:  moonDisplacementMap,
        displacementScale: 0.1
    });

    // Create the mesh and apply an axial tilt to the Moon:
    const moonMesh = new THREE.Mesh(moonGeom, moonMat);
    moonMesh.rotation.x = 1.54 * Math.PI / 180; // https://svs.gsfc.nasa.gov/5229/

    scene.add(moonMesh);
    
    return moonMesh;
}

/*
The following function creates the Moons orbit. To see more information on this, please see SCALING_AND_CALCULATIONS.md
on this projects GitHub repo.
*/
export function createMoonOrbit(earth, moonMesh) {
    // https://moon.nasa.gov/resources/429/the-moons-orbit-and-rotation/
    // https://svs.gsfc.nasa.gov/5326/
    // This simulation uses a scale factor as follows: 10 units / 6,371 km = ~0.00157 units per km
    // The moon is around 384,400 km away from the Earth during portions of its orbit.
    // Therefore, this value is used to calculate the following: 384,400 km * 0.00157 units per km = ~602.94 units
    const moonOrbitRadius = CONSTANTS.EARTH_MOON_ORBITAL_RADIUS; // 602.94

    // https://science.nasa.gov/moon/top-moon-questions/#h-does-the-moon-rotate-does-the-moon-spin-on-its-axis
    const moonOrbitPeriod = CONSTANTS.EARTH_MOON_ORBITAL_PERIOD; // 27.3 * 24 * 60 * 60: Measured in seconds.

    // Calculate the Moons rotation around its axis expressed as radians / second:
    // 2PI / 27.3 * 24 * 60 * 60 = ~2.66 * 10^-6
    const moonRotationSpeed = 2 * Math.PI / moonOrbitPeriod;

    // Note: The following calculations used the help of generative AI and were confirmed and validated with a variety of resources to ensure accuracy:
    // Get variables to calculate the Moons location in orbit relative to the Earth (https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html):
    const semiMajorAxis = CONSTANTS.EARTH_MOON_SEMI_MAJOR_AXIS; // 384400 (https://ssd.jpl.nasa.gov/glossary/semimajor_axis.html)
    const eccentricity = CONSTANTS.EARTH_MOON_ECCENTRICITY; // 0.0549 (https://ssd.jpl.nasa.gov/glossary/eccentricity.html)
    const inclination = THREE.MathUtils.degToRad(CONSTANTS.EARTH_MOON_INCLINATION); // 5.145 (https://ssd.jpl.nasa.gov/glossary/inclination.html)
    
    // The following post helped me find the information below: https://physics.stackexchange.com/a/322443
    // The following website is where I found the data: https://ssd.jpl.nasa.gov/sats/elem/
    const ascendingNode = THREE.MathUtils.degToRad(CONSTANTS.EARTH_MOON_ASCENDING_NODE); // 125.0 (https://cneos.jpl.nasa.gov/glossary/asc_node.html)
    const argPeriapsis = THREE.MathUtils.degToRad(CONSTANTS.EARTH_MOON_ARG_PERIAPSIS); // 318.15 (https://science.nasa.gov/learn/basics-of-space-flight/chapter5-1/)
    const meanAnomalyAtEpoch = THREE.MathUtils.degToRad(CONSTANTS.EARTH_MOON_MEAN_ANOMALY_J2000_EPOCH); // 135.27 (https://ssd.jpl.nasa.gov/glossary/ma.html)
    
    // Get the epoch and current time:
    // https://ssd.jpl.nasa.gov/tools/jdc/#/cd
    const epoch = new Date(Date.UTC(2000, 0, 1, 12)); // 2000-01-01.5 or J2000.0
    const now = new Date();
    const t = (now - epoch) / 1000; // Current time in seconds since epoch.

    // Step 1) Calculate Mean Motion (https://en.wikipedia.org/wiki/Mean_motion):
    // Let P be the moons orbital period. 
    // Mean motion (n): n = 2 * PI / P
    const meanMotion = 2 * Math.PI / moonOrbitPeriod;

    // Step 2) Calculate Mean Anomaly (https://en.wikipedia.org/wiki/Mean_anomaly):
    // Let M0 be mean anomaly at the epoch time t0, n be mean motion, t be the time at which to calculate the mean anomoly.
    // Mean anomaly (M): M = M0 + n(t - t0)
    // Since we have already calculated t - t0 and set this equal to var. t, we can write the mean anomaly as:
    const meanAnomaly = meanAnomalyAtEpoch + meanMotion * t;

    // Normalize the mean anomaly for further use:
    const meanAnomalyNormalized = meanAnomaly % (2 * Math.PI);

    // Step 3) Solve Kepler's Equation (https://en.wikipedia.org/wiki/Kepler%27s_equation):
    // Let E be the eccentric anomaly, M be the mean anomaly, e be the eccentricity.
    // Kepler's equation is M = E - e * sin(E), however, this code will instead use the following version: E = M + e * sin(E)
    // The code will solve this equation via the fixed-point iteration method: https://en.wikipedia.org/wiki/Kepler%27s_equation#Fixed-point_iteration
    // Very helpful for learning more -> https://duncaneddy.github.io/rastro/user_guide/orbits/anomalies/
    function keplersEquation(M, e, tol = 1e-6, maxIter = 100) {
        let E = M; // Initial guess 
        
        for (let i = 0; i < maxIter; i++) { 
            let E_next = M + e * Math.sin(E);

            if (Math.abs(E_next - E) < tol) { 
                break;
            } 
            
            E = E_next;
        }
        
        return E; 
    }

    // Step 4) Eccentric Anomaly (https://en.wikipedia.org/wiki/Eccentric_anomaly):
    // Find the eccentric anomaly (E) with Kepler's equation:
    const eccentricAnomaly = keplersEquation(meanAnomalyNormalized, eccentricity);

    // Step 5) True Anomaly (https://en.wikipedia.org/wiki/True_anomaly):
    // Let E be the eccentric anomaly, e be the eccentricity.
    // True Anomaly (v): v = 2 * arctan(sqrt( 1 + e / 1 - e) * tan(E / 2))
    // As the Math.atan() function does not determine the correct quadrant of the angle, the Math.atan2() function is used here:
    const moonTrueAnomaly = 2 * Math.atan2(
        Math.sqrt(1 + eccentricity) * Math.sin(eccentricAnomaly / 2), 
        Math.sqrt(1 - eccentricity) * Math.cos(eccentricAnomaly / 2)
    );
    
    // Next, we can calculate a position in orbit (https://en.wikipedia.org/wiki/File:Orbit1.svg):
    // Step 6) Distance (https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion#Distance,_r):
    // Distance can be verified here: https://eyes.nasa.gov/apps/solar-system/#/moon/distance?to=earth
    // This is the measure from the center of the Moon to the center of the Earth in km:
    // Let a be the semi major axis, e be the eccentricity, and E be the eccentric anomaly.
    // Distance (r): r = a(1 - e * cos(E))
    const distance = semiMajorAxis * (1 - eccentricity * Math.cos(eccentricAnomaly));

    // Step 7) Convert polar coordinates to Cartesian:
    // Compute the position in the orbital plane:
    const x = distance * Math.cos(moonTrueAnomaly);
    const y = distance * Math.sin(moonTrueAnomaly);
    const z = 0;

    // Step 8)
    // Apply rotation by the argument of periapsis (ω) (https://en.wikipedia.org/wiki/Argument_of_periapsis):
    // To compute the next part, a rotation matrix (https://en.wikipedia.org/wiki/Rotation_matrix) is used to derive the following:
    const xPrime = Math.cos(argPeriapsis) * x - Math.sin(argPeriapsis) * y; 
    const yPrime = Math.sin(argPeriapsis) * x + Math.cos(argPeriapsis) * y;
    const zPrime = z;

    // Apply rotation by inclination (i) (https://en.wikipedia.org/wiki/Orbital_inclination):
    // To compute the next part, a rotation matrix (https://en.wikipedia.org/wiki/Rotation_matrix) is used to derive the following:
    const xDoublePrime = xPrime; 
    const yDoublePrime = yPrime * Math.cos(inclination);
    const zDoublePrime = yPrime * Math.sin(inclination);

    // Apply rotation by the longitude of the ascending node (Ω) (https://en.wikipedia.org/wiki/Longitude_of_the_ascending_node):
    // To compute the next part, a rotation matrix (https://en.wikipedia.org/wiki/Rotation_matrix) is used to derive the following:
    const finalX = Math.cos(ascendingNode) * xDoublePrime - Math.sin(ascendingNode) * yDoublePrime;
    const finalY = Math.sin(ascendingNode) * xDoublePrime + Math.cos(ascendingNode) * yDoublePrime;
    const finalZ = zDoublePrime;

    // Step 9) Scale the values to be correct in this simulation:
    /* 
    The Z and Y values are swapped here as Three.js (and other 3D software) use a different coordinate system where the 
    positive/negative Y-axis represents the axis orthogonal to the XZ plane, whereas in some other contexts,
    the Z-axis might be used for the vertical axis. This swap aligns the coordinate systems correctly.

    Three.js uses a right-handed coordinate system:
    https://learn.microsoft.com/en-us/windows/win32/direct3d9/coordinate-systems
    */
    const scaledFinalX = earth.position.x - (finalX * CONSTANTS.SCALE_FACTOR);
    const scaledFinalY = earth.position.z + (finalY * CONSTANTS.SCALE_FACTOR);
    const scaledFinalZ = (finalZ * CONSTANTS.SCALE_FACTOR);

    // Step 10) Set the Moon's position:
    moonMesh.position.set(scaledFinalX, scaledFinalZ, scaledFinalY);

    return {moonOrbitRadius, moonOrbitPeriod, moonRotationSpeed, distance, moonTrueAnomaly};
}