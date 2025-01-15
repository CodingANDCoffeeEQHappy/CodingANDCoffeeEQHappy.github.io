/*
CodingANDCoffeeEQHappy
Version 1.6.0
This file contains code to create the Sun mesh and related functions.
*/
import * as THREE from '../packages/threeJS/build/three.module.js';
import * as CONSTANTS from '../js/constants.js';

// The following function creates a light to simulate the Sun's light:
export function createSunLight(scene) {
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
    sunLight.position.set(0, 0, 0);
    sunLight.target.position.set(0, 0, 0);
    scene.add(sunLight);
    scene.add(sunLight.target);
    
    return sunLight;
}

// The following creates the Sun mesh;
export function createSunMesh(scene) {
    // https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html
    // Sun Radius in km * Scale Factor = Scaled Sun Radius
    // 695,700.0 km * 0.00157 units/km = ~1092.24 units
    const sunGeom = new THREE.SphereGeometry(CONSTANTS.SUN_RADIUS, 64, 64);
    
    // Use a random noise function in a shader to make the Sun look a little more realistic:
    const sunMaterial = new THREE.ShaderMaterial({
        uniforms: {
            time: {value: 0.0}
        },
        vertexShader: `
            varying vec3 vPosition;

            void main() {
                vPosition = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float time;
            varying vec3 vPosition;

            float noise(vec3 p) {
                return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
            }

            void main() {
                float n = noise(vPosition * 10.0 + time);
                vec3 color = mix(vec3(1.0, 0.5, 0.0), vec3(1.0, 0.8, 0.0), n);
                gl_FragColor = vec4(color, 1.0);
            }
        `,
        side: THREE.FrontSide,
        transparent: true
    });

    const sunMesh = new THREE.Mesh(sunGeom, sunMaterial);

    // The following shader is modified code from the following article:
    // https://franky-arkon-digital.medium.com/make-your-own-earth-in-three-js-8b875e281b1e
    const sunGlowGeom = new THREE.SphereGeometry(2400, 64, 64);
    const sunGlowMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            // https://franky-arkon-digital.medium.com/make-your-own-earth-in-three-js-8b875e281b1e
            // https://github.com/franky-adl/threejs-earth/blob/main/src/shaders/vertex.glsl
            varying vec3 vNormal;
            varying vec3 eyeVector;

            void main() {
                vec4 mvPos = modelViewMatrix * vec4( position, 1.0 );
                vNormal = normalize( normalMatrix * normal );
                eyeVector = normalize(mvPos.xyz);
                gl_Position = projectionMatrix * mvPos;
            }
        `,
        fragmentShader: `
            // https://franky-arkon-digital.medium.com/make-your-own-earth-in-three-js-8b875e281b1e
            // https://github.com/franky-adl/threejs-earth/blob/main/src/shaders/fragment.glsl
            varying vec3 vNormal;
            varying vec3 eyeVector;
            const float atmOpacity = 0.1;
            const float atmPowFactor = 5.0;
            const float atmMultiplier = 9.5;

            void main() {
                float dotP = dot(vNormal, eyeVector);
                float factor = pow(dotP, atmPowFactor) * atmMultiplier;
                vec3 atmColor = vec3(0.30 + dotP / 4.5, 0.35 + dotP / 4.5, 0);
                gl_FragColor = vec4(atmColor, atmOpacity) * factor;
            }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    });

    const sunsGlowMesh = new THREE.Mesh(sunGlowGeom, sunGlowMaterial);

    return {sunsGlowMesh, sunMesh};
}