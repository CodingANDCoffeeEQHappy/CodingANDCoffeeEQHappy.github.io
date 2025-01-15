/*
CodingANDCoffeeEQHappy
Version 1.6.0
This file controls the camera auto-rotate around the Earth.
*/
let idleDuration = 30_000;
let isUserActive = true;
let isDialogOpen = false;
let idleTimer;
const autoRotateSpeed = 0.1;

export function setDialogOpen(dialogOpen) {
    isDialogOpen = dialogOpen;
}

function startAutoRotate(controls) {
    controls.autoRotate = true;
    controls.autoRotateSpeed = autoRotateSpeed;
}

function stopAutoRotate(controls) {
    controls.autoRotate = false;
}

/*
The following checks if the user is not active (mouse/touch inputs) for 30 seconds (and not in a modal/dialog window)
and then begins to orbit the camera around the Earth slowly:
*/
export function resetIdleTimer(controls) {
    clearTimeout(idleTimer);
    stopAutoRotate(controls);
    isUserActive = true;

    idleTimer = setTimeout(() => {
        if (isDialogOpen) {
            resetIdleTimer(controls);
        } else {
            isUserActive = false;
            startAutoRotate(controls);
        }
    }, idleDuration);
}