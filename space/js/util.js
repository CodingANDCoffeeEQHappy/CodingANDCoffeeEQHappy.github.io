/*
CodingANDCoffeeEQHappy
Version 1.6.0
*/
import * as THREE from '../packages/threeJS/build/three.module.js';

// The following function is very similar and used in a similar way as the function found at this URL:
// https://github.com/franky-adl/threejs-earth/blob/9a98346b5d6a8575dd8837e16fea776f30f7784d/src/common-utils.js#L55
// The following function is used to load textures for use in Three.js meshes.
export async function loadTexures(url) {
    const textureLoader = new THREE.TextureLoader();

    return new Promise(resolve => {
        textureLoader.load(url, texture => {
            resolve(texture);
        });
    });
}