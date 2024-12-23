/*
CodingANDCoffeeEQHappy
Version 1.0.0
This file controls the main page animation/movement using a variety of CSS styles that can be found in style.css.
*/
// The following uses a simple fade to display the page content once it loads: 
window.addEventListener('load', function() { 
    document.body.classList.add('animate');
});

document.addEventListener("DOMContentLoaded", function() {
    let typeFlag = false;
    let index = 0;
    
    let currentInputTextHeader, currentInputTextPara;

    // The following objects are used to update the text on the information page:
    const inputTextHeader = {
        whoAmI: "whoami",
        skills: "Skills",
        education: "Education",
        moreInfo: "More Info"
    }

    const inputTextPara = {
        whoAmI: "I am a computer science student and undergraduate researcher with a diverse set of skills and an excitement to learn.",
        skills: "I have a diverse technical skillset, including programming, networking, cybersecurity, and more.",
        education: "I will earn my bachelor's degree in computer science and a minor in mathematics in the Spring 2025 semester. While I have gained substantial knowledge, I recognize there is always more to learn.",
        moreInfo: "This website was built with various different resources. Please use the 'More Info' button to learn more."
    }

    // Get the home page buttons:
    const whoAmIButton = document.getElementById("whoamiButton");
    const skillsButton = document.getElementById("skillsButton");
    const educationButton = document.getElementById("educationButton");
    const moreInfoButton = document.getElementById("moreInfoButton");

    // Get the info page back button:
    const backButton = document.getElementById("moveToRight");

    // Get the info page header and paragraph elements:
    const mainInfoHeader = document.getElementById("main_info_header");
    const mainInfoParagraph = document.getElementById("main_info_paragraph");

    // Get all of the main buttons:
    const buttons = document.querySelectorAll(".main_page_buttons");

    // Get the main containers:
    const buttonContainer = document.querySelector(".button_container");
    const textContainer = document.querySelector(".text_container");

    // The following function writes text to look as though its being typed:
    function writeText() {
        if (index < currentInputTextHeader.length && typeFlag) {
            mainInfoHeader.textContent += currentInputTextHeader.charAt(index);
            index++;
            setTimeout(writeText, 200);
        }
    }

    // The following function allows the buttons to open and populate the info page:
    function openInfoPage() {
        // Fade the text on the main buttons:
        buttons.forEach(button => button.classList.add("fade_text"));

        setTimeout(() => {
            // Use the container animations to make them move to the left:
            buttonContainer.classList.toggle("animate");
            textContainer.classList.toggle("animate");
        
            mainInfoHeader.textContent = ""; // Ensure text exists in the header.
            mainInfoParagraph.textContent = currentInputTextPara; // Add the main info text.
            index = 0; // Reset the index.
            typeFlag = true; // Allows typing (prevents typing if page is swapped back to home page rapidly).
            writeText(); // Write text using 'animated' typing function.
            setTimeout(() => buttons.forEach(button => button.classList.remove("fade_text")), 1000); // Fade the text back in after 1 second delay.

            // Toggle the main header element so it is visible:
            mainInfoHeader.classList.toggle("animate");
        }, 500);

        // Toggle the main paragraph element so it is visible (after 1.5 seconds):
        setTimeout(() => mainInfoParagraph.classList.toggle("animate"), 1500);
    }
    
    // Create event listeners for each main button (each listener updates a var to write the proper text into the page elements):
    whoAmIButton.addEventListener("click", function() {
        currentInputTextHeader = inputTextHeader.whoAmI;
        currentInputTextPara = inputTextPara.whoAmI;
        openInfoPage();

        // Sets a 'clicked' class for a check in JavaScript later on:
        whoAmIButton.classList.add("clicked");
    });

    skillsButton.addEventListener("click", function() {
        currentInputTextHeader = inputTextHeader.skills;
        currentInputTextPara = inputTextPara.skills;
        openInfoPage();

        // Sets a 'clicked' class for a check in JavaScript later on:
        skillsButton.classList.add("clicked");
    });

    educationButton.addEventListener("click", function() {
        currentInputTextHeader = inputTextHeader.education;
        currentInputTextPara = inputTextPara.education;
        openInfoPage();

        // Sets a 'clicked' class for a check in JavaScript later on:
        educationButton.classList.add("clicked");
    });

    moreInfoButton.addEventListener("click", function() {
        currentInputTextHeader = inputTextHeader.moreInfo;
        currentInputTextPara = inputTextPara.moreInfo;
        openInfoPage();

        // Sets a 'clicked' class for a check in JavaScript later on:
        moreInfoButton.classList.add("clicked");
    });

    // Move home page back onto the screen (uses event listener for the back button click):
    backButton.addEventListener("click", function() {
        buttons.forEach(button => button.classList.add("fade_text"));

        // Remove the 'clicked' class from the home page buttons:
        document.querySelectorAll("button").forEach(ele => ele.classList.remove("clicked"));

        setTimeout(() => {
            setTimeout(() => {
                buttonContainer.classList.toggle("animate");
                textContainer.classList.toggle("animate");
            }, 300);
            
            // Reset the page so it appears as normal:
            typeFlag = false;
            setTimeout(() => buttons.forEach(button => button.classList.remove("fade_text")), 1000);
            mainInfoHeader.classList.toggle("animate");    
            mainInfoParagraph.classList.toggle("animate");
            mainInfoParagraph.textContent = "";
        }, 500);
    });
});