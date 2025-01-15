/*
CodingANDCoffeeEQHappy
Version 1.6.0
This file contains functions to handle mouse inputs.
*/
import * as THREE from '../packages/threeJS/build/three.module.js';
import * as CITY_MODAL from './cityInfoModal.js';

// The following handles when a city is clicked:
export function onClickCity(event, camera, scene, earthLayer, earth, moon, sun) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    if (typeof camera !== 'undefined') {
        // Find the location where the mouse click occured:
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // Use a raycast to find if a city was clicked:
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        
        if (intersects.length > 0) {
            if (intersects.some(ele => ele.object.isSprite && ele.object.material.visible == true)) {
                // The sprite the user clicked on:
                const hoveredSprite = intersects.find(ele => ele.object.isSprite && ele.object.material.visible == true);

                // Display modal for the city:
                CITY_MODAL.openCityInfoModal(hoveredSprite.object, earth, moon, sun);

                // Reset the sprites color:
                hoveredSprite.object.material.color.set(0xffffff);
            }
        }
    }
}

// The following handles the mouse hover over each sprite:
export function onMouseMove(event, camera, scene, earthCityLabelLayer, earthLabelGroup) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    if (typeof camera !== 'undefined') {
        // Get the mouse position:
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        // Use a raycast to determine what the mouse is hovering over:
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            if (intersects.some(ele => ele.object.isSprite && ele.object.material.visible == true)) {
                // Find the sprite:
                const hoveredSprite = intersects.find(ele => ele.object.isSprite && ele.object.material.visible == true);

                // Update mouse cursor:
                document.body.style.cursor = 'pointer';
                
                // Update the sprites color:
                hoveredSprite.object.material.color.set(0xff0000);

            } else {
                // Update mouse cursor back to default:
                document.body.style.cursor = 'default';

                // Update all city sprites color back to default:
                if (typeof earthCityLabelLayer !== 'undefined') {
                    earthCityLabelLayer.children.forEach(sprite => {
                        if (sprite.material.visible == true) {
                            sprite.material.color.set(0xffffff);
                        }
                    });
                }

                // Reset the Earth label color:
                if (typeof earthLabelGroup !== 'undefined') {
                    earthLabelGroup.children.forEach(sprite => {
                        if (sprite.material.visible == true) {
                            sprite.material.color.set(0xffffff);
                        }
                    });
                }
            }
        } else {
            // Update mouse cursor back to default:
            document.body.style.cursor = 'default';

            // Update all city sprites color back to default:
            if (typeof earthCityLabelLayer !== 'undefined') {
                earthCityLabelLayer.children.forEach(sprite => {
                    if (sprite.material.visible == true) {
                        sprite.material.color.set(0xffffff);
                    }
                });
            }

            // Reset the Earth labels color:
            if (typeof earthLabelGroup !== 'undefined') {
                earthLabelGroup.children.forEach(sprite => {
                    if (sprite.material.visible == true) {
                        sprite.material.color.set(0xffffff);
                    }
                });
            }
        }
    }
}