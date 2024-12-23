/*
CodePen example: https://codepen.io/semdeck/pen/abQBwKN

Copyright (c) 2024 by SEMdeck Digital (https://codepen.io/semdeck/pen/abQBwKN)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
window.addEventListener('load', function() { 
    document.getElementById("stars").classList.add('animate');
});

document.addEventListener("DOMContentLoaded", function() {
    const starCount = 20;
    const shootingStarInterval = 8000;

    function createStar() {
        const star = document.createElement("div");

        star.className = "star";
        star.style.top = `${Math.random() * 100}%`;
        star.style.left = `${Math.random() * 100}%`;
        
        document.getElementById("stars").appendChild(star);
    }

    function createShootingStar() {
        // Check to ensure a modal does not exist on current page or is not currently open (do not display shooting stars if a modal is open):
        if (!(document.getElementById("moreInfoModal")) || window.getComputedStyle(document.getElementById("moreInfoModal")).display == "none") {
            const shootingStar = document.createElement("div");
            
            shootingStar.className = "shooting-star";
            shootingStar.style.top = `${Math.random() * 100}%`;
            shootingStar.style.left = `${Math.random() * 100}%`;
            
            document.getElementById("stars").appendChild(shootingStar);

            setTimeout(function() {
                document.getElementById("stars").removeChild(shootingStar);
            }, 3000);
        }
    }

    function generateStars() {
        for (let i = 0; i < starCount; i++) {
            createStar();
        }
    }

    function randomizeShootingStarInterval() {
        const interval = Math.random() * shootingStarInterval;

        setTimeout(function() {
            createShootingStar();
            randomizeShootingStarInterval();
        }, interval);
    }
    
    generateStars();
    setTimeout(createShootingStar, Math.random() * shootingStarInterval);
    randomizeShootingStarInterval();
});