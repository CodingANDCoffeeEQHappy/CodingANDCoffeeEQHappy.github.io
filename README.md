# CodingANDCoffeeEQHappy Personal Website

## Project Overview 💻
- This project includes my personal website, designed to showcase my work and skills. I hope it can serve as a valuable resource for potential employers and others interested in learning more about my professional journey.
- In addition to this main site, I have also created a simple real-time simulation of the Earth, Moon, and Sun using Three.js. This simulation uses satellite imagery from NASA to create textures for the Earth and Moon. The Earth's position relative to the Sun and the Moon's position relative to the Earth are approximately calculated using [Kepler's Laws of Planetary Motion](https://en.wikipedia.org/wiki/Kepler%27s_laws_of_planetary_motion#Position_as_a_function_of_time). Additionally, the simulated Earth includes interactive features and data, including real-time time zone calculations and semi-real-time weather data for a few cities on Earth. To find more information about the work behind this portion of the project, please check out this document for more details.
- My space simulation is heavily inspired by [NASA's Eyes on the Solar System](https://eyes.nasa.gov/apps/solar-system/#/home) and [Google Earth](https://earth.google.com/). [NASA's Eyes on the Solar System](https://eyes.nasa.gov/apps/solar-system/#/home) is one of my favorite [Three.js](https://threejs.org/) projects, and I really enjoy the research and effort in this project. Although I wanted to make my project unique, it shares a few similar features. [Eyes on the Solar System](https://eyes.nasa.gov/apps/solar-system/#/home) is an amazing learning tool, and I recommend checking it out if you haven't.
- If you would like to visit the main site to learn more about me, please click [here](https://codingandcoffeeeqhappy.github.io/helloworld.html). If you would like to check out my space simulation website, please click here.

*Thank you for checking it out!*

## Resources Used 📃
### Main Site (index.html and helloworld.html) 💻
- The animated [coffee cup](https://codepen.io/Sneha_P_P/pen/LXWWox) and [star/shooting stars](https://codepen.io/semdeck/pen/abQBwKN) are adapted from example code found on [CodePen](https://codepen.io/). Special thanks to [Sneha P P](https://codepen.io/Sneha_P_P) and [SEMdeck Digital](https://codepen.io/semdeck) on CodePen for their inspiring examples. The code has been modified and is used under the MIT License. All license/copyright information can be found in the respective files that include code used from these examples in comments at the top of the file.

### Space Site (space.html) 🚀
- To help create the Earth model for this portion of the project, I used [this amazing article](https://franky-arkon-digital.medium.com/make-your-own-earth-in-three-js-8b875e281b1e) by [Franky Hung](https://github.com/franky-adl). This article taught me how to create the Earth model, apply the textures, and write shaders to improve the realistic look of the Earth.
- On the loading page for the space simulation, there is an animated [coffee cup](https://codepen.io/Sneha_P_P/pen/LXWWox), [star/shooting stars](https://codepen.io/semdeck/pen/abQBwKN), and [space shuttle](https://codepen.io/milessebesta/pen/KKzXRVW) which are adapted from example code found on [CodePen](https://codepen.io/). Special thanks to [Sneha P P](https://codepen.io/Sneha_P_P), [SEMdeck Digital](https://codepen.io/semdeck), and [Miles S](https://codepen.io/milessebesta) on CodePen for their inspiring examples. The code has been modified and is used under the MIT License. All license/copyright information can be found in the respective files that include code used from these examples in comments at the top of the file.
- NASA Images:
    - *The script that downloads and saves these images in this repo can be found here.*
    1) [The Tycho Catalog Skymap - Version 2.0](https://svs.gsfc.nasa.gov/vis/a000000/a003500/a003572/TychoSkymapII.t3_08192x04096.jpg)
        - [Image Credit](https://svs.gsfc.nasa.gov/3572/): NASA/Goddard Space Flight Center Scientific Visualization Studio
    2) [The Blue Marble: Land Surface, Ocean Color and Sea Ice](https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57730/land_ocean_ice_8192.png)
        - [Image Credit](https://visibleearth.nasa.gov/images/57730/the-blue-marble-land-surface-ocean-color-and-sea-ice): NASA Goddard Space Flight Center Image by Reto Stöckli (land surface, shallow water, clouds). Enhancements by Robert Simmon (ocean color, compositing, 3D globes, animation). Data and technical support: MODIS Land Group; MODIS Science Data Support Team; MODIS Atmosphere Group; MODIS Ocean Group Additional data: USGS EROS Data Center (topography); USGS Terrestrial Remote Sensing Flagstaff Field Center (Antarctica); Defense Meteorological Satellite Program (city lights).
    3) [Earth at Night (Black Marble) 2016 Color Maps](https://eoimages.gsfc.nasa.gov/images/imagerecords/144000/144898/BlackMarble_2016_01deg.jpg)
        - [Image Credit](https://www.visibleearth.nasa.gov/images/144898/earth-at-night-black-marble-2016-color-maps): NASA Earth Observatory images by Joshua Stevens, using Suomi NPP VIIRS data from Miguel Román, NASA GSFC
    4) [Topography](https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73934/srtm_ramp2.worldx294x196.jpg)
        - [Image Credit](https://visibleearth.nasa.gov/images/73934/topography): Imagery by Jesse Allen, NASA's Earth Observatory, using data from the General Bathymetric Chart of the Oceans (GEBCO) produced by the British Oceanographic Data Centre.
    5) [Draining the Oceans](https://svs.gsfc.nasa.gov/vis/a000000/a003400/a003487/landmask4K.png)
        - [Image Credit](https://svs.gsfc.nasa.gov/3487): NASA/Goddard Space Flight Center Scientific Visualization Studio, U.S. Department of Commerce, National Oceanic and Atmospheric Administration, National Geophysical Data Center, 2006, 2-minute Gridded Global Relief Data (ETOPO2v2) - http://www.ngdc.noaa.gov/mgg/fliers/06mgg01.html The Blue Marble Next Generation data is courtesy of Reto Stockli (NASA/GSFC) and NASA's Earth Observatory.
    6) [Blue Marble: Clouds](https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57747/cloud_combined_2048.jpg)
        - [Image Credit](https://www.visibleearth.nasa.gov/images/57747/blue-marble-clouds): NASA Goddard Space Flight Center Image by Reto Stöckli (land surface, shallow water, clouds). Enhancements by Robert Simmon (ocean color, compositing, 3D globes, animation). Data and technical support: MODIS Land Group; MODIS Science Data Support Team; MODIS Atmosphere Group; MODIS Ocean Group Additional data: USGS EROS Data Center (topography); USGS Terrestrial Remote Sensing Flagstaff Field Center (Antarctica); Defense Meteorological Satellite Program (city lights).
    7) [CGI Moon Kit](https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/lroc_color_poles_1k.jpg)
    8) [CGI Moon Kit](https://svs.gsfc.nasa.gov/vis/a000000/a004700/a004720/ldem_3_8bit.jpg)
        - [Image Credit](https://svs.gsfc.nasa.gov/4720): NASA's Scientific Visualization Studio
- [OpenWeatherMap](https://openweathermap.org/):
    - *The script that downloads and saves the weather data in this repo can be found here, and the script that downloads and saves the weather icons can be found here.*
    - The [OpenWeatherMap API](https://openweathermap.org/api) is used to get weather data for this website.
        - Weather data is updated on this GitHub repo every hour and the simulation website attempts to use the most up-to-date data. While OpenWeatherMap offers up-to-date and accurate data, I chose this method to limit API calls/costs. The returned JSON is saved into this repo, and the simulation website parses the JSON and updates the page. Additionally, the webpage displays the time and date when the data was added to this GitHub repo to inform users of the age of the data they are viewing. This should hopefully ensure a clear description of the data's accuracy.
    - OpenWeatherMap also provides [weather icons](https://openweathermap.org/weather-conditions) to represent different weather conditions, and these are used on this site.
- [Wikipedia](https://en.wikipedia.org/wiki/Main_Page): Some information in this project is sourced from Wikipedia and is available under the Creative Commons Attribution-ShareAlike license. Links to Wikipedia pages can be found in the code and on the webpage where needed.

### Packages
#### Frontend:
- [Three.js](https://threejs.org/): This library is used for the 3D graphics on the space simulation webpage.
    - The Three.js [OrbitControls.js](https://threejs.org/docs/#examples/en/controls/OrbitControls) were also used for this project.
- [DOMPurify](https://github.com/cure53/DOMPurify): This library is used on the client for sanitizing the JSON data pulled from API calls and stored in this repo.

#### Backend:
- [Axios](https://github.com/axios/axios): This library is used to make API requests in the backend code. In this case, Axios is used in a GitHub Actions script within a Node.js environment to make OpenWeatherMap API requests.
- [Isomorphic-dompurify](https://github.com/kkomelin/isomorphic-dompurify): This library is used to sanitize the returned data from API requests. This package allows DOMPurify to run easily in this environment and works very well. The purpose of running this on the server as well as the client is to ensure all data is as clean as possible before saving it within this repo and serving to clients. Both of these libraries are very efficient and so I believe this is a worthwhile decision.

## License ⚖️
- Please see [this](https://github.com/CodingANDCoffeeEQHappy/CodingANDCoffeeEQHappy.github.io/blob/main/LICENSE) document for more information.
    - The source code is licensed under the MIT License.