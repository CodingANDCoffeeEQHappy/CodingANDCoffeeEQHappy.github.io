/*
CodingANDCoffeeEQHappy
Version 1.0.0
This file controls the modal buttons and text.
*/
document.addEventListener("DOMContentLoaded", function() {
    // Get the modals buttons, dialog element, and overlay:
    const displayModalButton = document.getElementById("displayModal");
    const closeModalButton = document.getElementById("closeModalButton");
    const dialog = document.getElementById("moreInfoModal");
    const overlay = document.getElementById("overlay");

    // Get the modal header and paragraph elements:
    const mainInfoHeaderModal = document.getElementById("modalHeader");
    const mainInfoParagraphModal = document.getElementById("modalPara");

    // The following vars are used for the typing function:
    let typeFlagModal = false;
    let indexModal = 0;
    let currentInputTextHeaderModal, currentInputTextParaModal;

    // The following objects are used to update the text on the information page:
    const inputTextHeaderModal = {
        whoAmI: "whoami",
        skills: "Skills",
        education: "Education",
        moreInfo: "More Info"
    };

    const inputTextParaModal = {
        whoAmI: "I am a computer science student and undergraduate researcher currently focused on data science and machine learning, particularly with large geospatial datasets. I have skills in software engineering, networking, cybersecurity, and microcontroller programming. Additionally, I have experience in game development with Unity and Unreal Engine, with a preference for Unity. I enjoy developing software that helps people and leverages visuals to present information. I thrive on solving complex problems and tackling technical challenges.",
        skills: "<b>Programming Skills:</b><br/>Python, R, Bash, C/C#/C++, Java/Kotlin, JavaScript, CSS, and HTML.<br/><br/><b>Python Libraries & Frameworks:</b><br/>Flask, NumPy, Pandas, GeoPandas, Plotly, Matplotlib, and HoloViews. Some experience with Keras/TensorFlow and PyTorch.<br/><br/><b>R Libraries:</b><br/>ggplot2, tidyverse, and caret.<br/><br/><b>JavaScript Libraries & Frameworks:</b><br/>React, Node.js, Express.js, and some experience with Three.js.<br/><br/><b>Cloud Computing Experience:</b><br/>Experience with AWS products such as SageMaker, SageMaker Processing Jobs, S3, and some ECR experience.<br/><br/><b>Containerization/Virtualization Experience:</b><br/>Docker, OpenShift and hypervisor/VM experience.<br/><br/><b>Additional Tools:</b><br/>Git, GitLab, and GitHub experience. Unity and some Unreal Engine experience.",
        education: "<h3><b>Current Studies (In progress):</b></h3><i>Bachelor of Science, Computer Science</i><br/>Anticipated Graduation Date: May 2025<br/><br/><i>Bachelor of Science, Data Science (Biology Emphasis)</i><br/>Anticipated Graduation Date: May 2028<br/><br/><i>Minor, Mathematics</i><br/>Anticipated Graduation Date: May 2025<br/><br/><i>Graduate Cybersecurity Certificate</i><br/>Anticipated Graduation Date: May 2028<br/><br/><h3><b>Future Studies (Accepted, yet to begin):</b></h3><i>Master of Science, Computer Science</i><br/>Anticipated Graduation Date: May 2028<br/><br/><i>Minor, Physics</i><br/>Anticipated Graduation Date: May 2028<br/><br/><i>Graduate Artificial Intelligence Certificate</i><br/>Anticipated Graduation Date: May 2028",
        moreInfo: "<h3><b>Site Info:</b></h3>This site was built using vanilla JavaScript, HTML, and CSS. The page animations were created with CSS animations. The animated <a href='https://codepen.io/Sneha_P_P/pen/LXWWox' target='_blank'>coffee cup</a> and <a href='https://codepen.io/semdeck/pen/abQBwKN' target='_blank'>star/shooting stars</a> are adapted from example code found on <a href='https://codepen.io/' target='_blank'>CodePen</a>. Special thanks to <a href='https://codepen.io/Sneha_P_P' target='_blank'>Sneha P P</a> and <a href='https://codepen.io/semdeck' target='_blank'>SEMdeck Digital</a> on CodePen for their inspiring examples. The code has been modified and is used under the MIT License. All license/copyright information can be found in the respective files that include code used from these examples in comments at the top of the file. The license information for this project can be found <a href='https://github.com/CodingANDCoffeeEQHappy/CodingANDCoffeeEQHappy.github.io/blob/main/LICENSE' target='_blank'>here</a>. The GitHub repo for this project can also be found <a href='https://github.com/CodingANDCoffeeEQHappy/CodingANDCoffeeEQHappy.github.io/' target='_blank'>here</a>.<br/><br/><h3><b>Projects:</b></h3>More updates coming soon!"
    };

    // The following function writes text to look as though it is being typed:
    function writeTextModal() {
        if (indexModal < currentInputTextHeaderModal.length && typeFlagModal) {
            mainInfoHeaderModal.textContent += currentInputTextHeaderModal.charAt(indexModal);
            indexModal++;
            setTimeout(writeTextModal, 300);
        }
    }

    function getModalText() {
        document.querySelectorAll("button").forEach(ele => {
            if (ele.classList.contains("clicked")) {
                Object.keys(inputTextHeaderModal).forEach(key => {
                    if (ele.textContent == inputTextHeaderModal[key]) {
                        currentInputTextHeaderModal = inputTextHeaderModal[key];
                        currentInputTextParaModal = inputTextParaModal[key];
                    }
                });
            }
        });
    }

    // The following event handler opens the modal when the more info button is clicked:
    displayModalButton.addEventListener("click", function() {
        // Enable close button:
        closeModalButton.disabled = false;

        // Show the overlay and update the display style for the modal:
        overlay.style.display = 'block';
        dialog.style.display = 'flex';

        /*
        The following 'offsetHeight' forces the browser to notice the change between 
        the inital display and opacity styles and the updated styles that follow:
        */
        dialog.offsetHeight;
        dialog.style.opacity = '1';

        getModalText();

        mainInfoHeaderModal.textContent = ""; // Ensure now text exists in the header.
        mainInfoParagraphModal.innerHTML = currentInputTextParaModal; // Add the main info text.
        indexModal = 0; // Reset the index.
        typeFlagModal = true; // Allows typing (prevents typing if page is swapped back to home page rapidly).
        writeTextModal(); // Write text using 'animated' typing function.
    });

    // The following event handler closes the modal when the back button is clicked:
    closeModalButton.addEventListener("click", function() {
        // Disable close button:
        closeModalButton.disabled = true;

        // Reset the default styles for the modals opacity and the overlays display style:
        dialog.style.opacity = '0';
        overlay.style.display = 'none';

        // Use a timeout to remove the modal with a slow fade:
        setTimeout(() => {
            dialog.style.display = 'none';
        }, 1000);
    });
});