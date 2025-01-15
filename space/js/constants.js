/*
CodingANDCoffeeEQHappy
Version 1.6.0
This file contains constant values for the Earth, Moon, and Sun.
*/
// ================================
// General constants:
// ================================
// Scale Factor = Earth Radius in Simulated Units / Earth Radius in km
// 10 units / 6,371 km = ~0.00157 units per km
export const SCALE_FACTOR = 0.00157; // units per km

// This is approx. 1 AU = ~149,597,870.7 km (https://cneos.jpl.nasa.gov/glossary/au.html)
export const AU_KM = 149597870.7;

// 149,597,870.7 km * 0.00157 units per km = ~234,868.657 units
export const AU_UNITS = AU_KM * SCALE_FACTOR; // ~234868.657


// ================================
// Earth constants:
// ================================
// https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
export const EARTH_REAL_RADIUS = 6371;
export const EARTH_RADIUS = 10;
export const EARTH_AXIAL_TILT = -1 * 23.44; // This is multiplied by -1 for proper coordinate system axes in Three.js.
const SECONDS_PER_DAY = 24 * 60 * 60;
export const EARTH_ROTATION_RATE = (2 * Math.PI) / SECONDS_PER_DAY;

// For Earth's orbit:
// https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html
export const EARTH_ECCENTRICITY = 0.0167;
export const EARTH_ORBITAL_PERIOD = 365.256;

// ================================
// Earth's Moon constants:
// ================================
// 1,737.4 km * 0.00157 units/km = ~2.72 (https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html)
export const EARTH_MOON_RADIUS = 2.72;

// For Moon's orbit:
// https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html
export const EARTH_MOON_ORBITAL_RADIUS = 602.94;
export const EARTH_MOON_ORBITAL_PERIOD = 27.3 * SECONDS_PER_DAY;
export const EARTH_MOON_SEMI_MAJOR_AXIS = 384400;
export const EARTH_MOON_ECCENTRICITY = 0.0549;
export const EARTH_MOON_INCLINATION = 5.145;

// For Moon's orbit (values at epoch J2000.0):
// https://ssd.jpl.nasa.gov/sats/elem/
export const EARTH_MOON_ASCENDING_NODE = 125.0;
export const EARTH_MOON_ARG_PERIAPSIS = 318.15;
export const EARTH_MOON_MEAN_ANOMALY_J2000_EPOCH = 135.27;


// ================================
// Sun constants:
// ================================
// https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
// Sun Radius in km * Scale Factor = Scaled Sun Radius
// 695,700.0 km * 0.00157 units/km = ~1092.24 units
export const SUN_RADIUS = 1092.24;
export const SUN_AXIAL_TILT = -1 * 7.25; // This is multiplied by -1 for proper coordinate system axes in Three.js.