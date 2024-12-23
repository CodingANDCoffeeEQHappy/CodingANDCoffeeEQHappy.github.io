/*
CodingANDCoffeeEQHappy
Version 1.0.0
*/
// The following uses a simple fade to display the page content once it loads: 
window.addEventListener('load', function() { 
    document.body.classList.add('animate');
});

document.addEventListener("DOMContentLoaded", function() {
    // The following button is used to load the main page:
    const loadMainPageButton = document.getElementById("loadMainPageButton");

    loadMainPageButton.addEventListener("click", function() {
        window.open("./helloworld.html", target="_self");
    });
});