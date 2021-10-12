const getmeteo = function (endurl) {
    let request = new XMLHttpRequest();

    request.addEventListener('readystatechange', function () {
        if (this.readyState == 4) {
            (this.status == 200) ? onSuccess(this.responseText): this.onError(this.status, this.statusText);
        } else {
           console.log("probleme de requete");
        }
    });

    request.open("get", `https://prevision-meteo.ch/services/json/${endurl}`, true);
    request.send();
}


function onError(statusCode, statusText) {
    console.log("error", statusCode, statusText);
}

function onSuccess(responseText) {
    const jsobjectClermont = JSON.parse(responseText);
    console.log(jsobjectClermont);

    cityInfoDeBase(jsobjectClermont);
    currentWeather(jsobjectClermont);
    // nextdayWeather();
}

function cityInfoDeBase(data) {
    let cityName = document.createElement('h1');
    myDiv.innerHTML = "";
    let cityContent = document.createElement('h4');
    cityContent.textContent = `Country: ` + data.city_info.country + ` / longitude: ` + data.city_info.longitude + ` / latitude: ` + data.city_info.latitude;
    cityName.textContent = data.city_info.name;
    myDiv.appendChild(cityName);
    myDiv.appendChild(cityContent);

}

function currentWeather(data) {
    let cityCWeatherUl = document.createElement('ul');
    let cityWeatherLi;
    // cityCWeatherUl.className = "list-inline";
    cityCWeatherUl.style.listStyle = 'none';

    for (const property in data) {
        if (/fcst/.test(property)) {           
            for (const prop in data[property]) { 
                console.log(prop, data[property][prop]);
                // console.log(data[property]);
                cityWeatherLi = document.createElement('li');
                // cityWeatherLi.className = "list-inline-item";
                if (prop == "icon_big") {
                    let icon = new Image();
                    icon.src = data[property][prop];
                    cityWeatherLi.appendChild(icon);
                } else if (prop == "hourly_data" || prop == "day_short" || prop == "condition_key" || prop == "icon") {
                    data[property][prop] = "";
                } else if (prop == "day_long") {
                    cityWeatherLi.textContent = "day: " + data[property][prop];
                } else {
                    cityWeatherLi.textContent = prop + ": " + data[property][prop];
                }
                console.log(`${prop}: ${data[property][prop]}`);
                // console.log(data.fcst_day_0[property]);
                cityCWeatherUl.appendChild(cityWeatherLi);
            }
        }

    }
    myDiv.appendChild(cityCWeatherUl);

}
// cityCWeatherUl.appendChild(cityWeatherLi);

function nextdayWeather() {
    let cityCWeatherUl = document.createElement('ul');
    cityCWeatherUl.className = "list-inline";
    cityCWeatherUl.style.listStyle = 'none';
    myDiv.appendChild(cityCWeatherUl);

    for (const property in jsobjectClermont.fcst_day_1) {
        let cityWeatherLi = document.createElement('li');
        cityWeatherLi.className = "list-inline-item";
        if (property == "icon_big") {
            let icon = new Image();
            icon.src = jsobjectClermont.fcst_day_1[property];
            cityWeatherLi.appendChild(icon);
        } else if (property == "hourly_data" || property == "day_short" || property == "condition_key" || property == "icon") {
            jsobjectClermont.fcst_day_1[property] = "";
        } else if (property == "day_long") {
            cityWeatherLi.textContent = "day: " + jsobjectClermont.fcst_day_1[property];
        } else {
            cityWeatherLi.textContent = property + ": " + jsobjectClermont.fcst_day_1[property];
        }
        // console.log(`${property}: ${jsobjectClermont.fcst_day_1[property]}`);
        // console.log(jsobjectClermont.fcst_day_1[property]);
        cityCWeatherUl.appendChild(cityWeatherLi);

    }
}



let myDiv = document.querySelector('div');
let clermontBtn = document.querySelector("#clermont");
clermontBtn.addEventListener('click', function () {
    getmeteo("lyon");
})

