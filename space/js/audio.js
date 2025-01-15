/*
CodingANDCoffeeEQHappy
Version 1.6.0
This file contains functions that control the audio played in this project.
*/
const playPauseButton = document.getElementById("mainMenuButton3");
// const backgroundMusic = new Audio("");
// backgroundMusic.loop = true;
// backgroundMusic.pause();

export function initAudio() {
    // backgroundMusic.play();
    
    // Update button text:
    playPauseButton.textContent = "Pause Music";

    playPauseButton.addEventListener("click", () => {
        // if (backgroundMusic.paused) {
        //     backgroundMusic.play();
    
        //     // Update button text:
        //     playPauseButton.textContent = "Pause Music";
        // } else {
        //     backgroundMusic.pause();
    
        //     // Update button text: 
        //     playPauseButton.textContent = "Play Music";
        // }
    });
}