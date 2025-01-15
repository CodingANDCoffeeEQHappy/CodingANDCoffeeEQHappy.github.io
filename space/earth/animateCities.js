/*
CodingANDCoffeeEQHappy
Version 1.6.0
This file is used to animate Three.js text sprites.
*/
// The following array stores the objects to be animated and some info about their animation:
export const fadeAnimations = [];

// The following function adds the objects to be animated into the array (the animation occurs in the animate function in main.js):
export function fadeTo(group, targetOpacity, duration) {
    group.children.forEach(mesh => {
        const initialOpacity = mesh.material.opacity;
        const startTime = performance.now();

        fadeAnimations.push({mesh, initialOpacity, targetOpacity, duration, startTime});
    });
}