/*
CodingANDCoffeeEQHappy
Version 1.6.0
This file contains code for the loading page.
*/
import * as AUDIO from './audio.js';

const loadingPage = document.getElementById("loadingPage");
const loadingPageHeader = document.getElementById("loadingPageHeader");
const coffeeDiv = document.getElementById("coffeeDiv");
const coffeeLoading = document.getElementById("coffee");
const loadingPageLoadingText = document.getElementById("loadingPageLoadingText");
const loadingPageInstructions = document.getElementById("loadingPageInstructions");
const loadingPageContinueButton = document.getElementById("loadingPageContinueButton");
const stars = document.getElementById("stars");
const spaceShuttle = document.getElementById("spaceShuttle");
const coffeeLoadingFullHeight = 110;
let loadVal = 0.0;

// Update the page loading text while textures load:
const updateLoadingText = setInterval(() => {
    loadingPageLoadingText.textContent += "."

    if (loadingPageLoadingText.textContent === "Loading....") {
        loadingPageLoadingText.textContent = "Loading";
    }
}, 1000);

// When the loading is finished, a button is displayed and this handles if the button is clicked.
loadingPageContinueButton.addEventListener("click", () => {
    loadingPageContinueButton.disabled = true;

    // The following animates the elements on the page:
    setTimeout(() => {
        loadingPageHeader.classList.add("remove");
        coffeeDiv.classList.add("remove");
        loadingPageLoadingText.classList.add("remove");
        loadingPageInstructions.classList.add("remove");
        loadingPageContinueButton.classList.remove("displayButtons");
        spaceShuttle.style.zIndex = 1100;
    }, 200);

    setTimeout(() => {
        spaceShuttle.classList.add("displayShuttle");
    }, 1500);

    setTimeout(() => {
        stars.classList.add("remove");
        loadingPage.classList.add("closeMenu");
        AUDIO.initAudio(); // Enable/play audio.
    }, 3100);
    
    setTimeout(() => {
        loadingPage.style.zIndex = -1;
        loadingPage.style.display = 'none';
    }, 5000);
});

// The following updates the loading element to indicate loading progress:
export function incrementLoader(val) {
    loadVal += val;
    coffeeLoading.style.height = loadVal * coffeeLoadingFullHeight + "px";

    if (loadVal === 1) {
        setTimeout(() => {
            loadingPageContinueButton.classList.add("displayButtons");    
    
            loadingPageContinueButton.disabled = false;
        }, 1000);

        clearInterval(updateLoadingText);
        loadingPageLoadingText.textContent = "Loading Complete!";
        coffeeLoading.classList.add("addDetail");
        coffeeLoading.classList.add("addSteam");
    }
}