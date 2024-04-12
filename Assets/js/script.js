const APIKey = "92edb6aeb57f1d6fb00670ba6d93d7a3";
const searchFormEl = document.querySelector(`#search-form`);
const resultCard = document.querySelector(`#current`);
const forecastCard = document.querySelector(`#forecast`);

function handleUserInput(event) {
  event.preventDefault();
  const cityNameInputval = document.querySelector(`#city-name-input`).value;
  if (cityNameInputval === "") {
    alert("You need a search input value!");
    return;
  }

  //Store user input inot the local storage
  if (cityNameInputval.length) {
    let previoussearch =
      JSON.parse(localStorage.getItem("historicalData")) || [];

    if (!previoussearch.includes(cityNameInputval)) {
      previoussearch.push(cityNameInputval);
      localStorage.setItem("historicalData", JSON.stringify(previoussearch));
    }

    // handhistorycalData();
  }

  handleSearchForCity(cityNameInputval);
  handleSearchForecastData(cityNameInputval);
}



function handhistorycalData(){
    let previoussearch =
      JSON.parse(localStorage.getItem("historicalData")) || [];
  //Create card to display historical search
  displayHistoryEl = document.querySelector("#displayHistory");

  //1- create elements
  const ulEl = document.createElement("ul");

  for (city of previoussearch) {
    //2-Create contents
    const liEl = document.createElement("button");
    liEl.classList.add(`buttonbtn`)
    liEl.textContent = city;
    ulEl.append(liEl);


  }

  // Append the elements to the container

  displayHistoryEl.append(ulEl);

}



//Get the city name and past it to the queryURL.
function handleSearchForCity(cityNameInputval) {
  const queryURL = `http://api.openweathermap.org/data/2.5/weather?q=${cityNameInputval}&appid=${APIKey}&units=imperial`;

  //For test purpose
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (dataApi) {
      console.log(dataApi);
      console.log(dataApi.name);

      // Print the results
      // Display current and future conditions for the city that what searched
      //   need to display: CIty Name, date, icon, temp, humidity, wind
      const resultBody = document.createElement("div");
      const cityNameEl = document.createElement("h3");
      const tempEl = document.createElement("p");
      const windEl = document.createElement("p");
      const humityEl = document.createElement("p");
      const iconEl = document.createElement("img");
      iconEl.setAttribute(
        "src",
        "http://openweathermap.org/img/w/" + dataApi.weather[0].icon + ".png"
      );

      var date = new Date(dataApi.dt * 1000);

      resultBody.classList.add("card-body");
      cityNameEl.textContent = dataApi.name + " " + date.toLocaleDateString();
      tempEl.textContent = "Temperature: " + dataApi.main.temp + " °F";
      humityEl.textContent = "Humidity: " + dataApi.main.humidity + " %";
      windEl.textContent = "Wind: " + dataApi.wind.speed + " MPH";
      //   resultDetails.textContent = dataApi.weather[0].main;
      cityNameEl.append(iconEl);
      resultBody.append(cityNameEl, tempEl, humityEl, windEl);
      resultCard.append(resultBody);

      //Store the value of the input into the local storage.
    });
}

function handleSearchForecastData(cityNameInputval) {
  // const cityNameInputval = document.querySelector(`#city-name-input`).value;
  const queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityNameInputval}&appid=${APIKey}&Unit=Imperial`;

  //For test purpose
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (dataApi) {
      console.log(dataApi);

      for (let i = 1; i < 41; i += 8) {
        console.log(dataApi.list[i]);
        let date = new Date(dataApi.list[i].dt * 1000);
        console.log(date.toLocaleDateString());

        // Creat cart with the follow data: Date, icon, temp, humidity, wind
        const forecastBody = document.createElement(`div`);
        const forecastDateEl = document.createElement("h3");
        const forecastTempEl = document.createElement("p");
        const fWindEl = document.createElement("p");
        const fHumityEl = document.createElement("p");
        const fIconEl = document.createElement("img");
        fIconEl.setAttribute(
          "src",
          "http://openweathermap.org/img/w/" +
            dataApi.list[i].weather[0].icon +
            ".png"
        );

        forecastBody.classList.add("card-body");
        forecastDateEl.textContent = date.toLocaleDateString();
        forecastTempEl.textContent =
          "Temperature: " + dataApi.list[i].main.temp + " °F";
        fHumityEl.textContent =
          "Humidity: " + dataApi.list[i].main.humidity + " %";
        fWindEl.textContent = "Wind: " + dataApi.list[i].wind.speed + " MPH";
        //ResultDetails.textContent = dataApi.weather[0].main;
        forecastBody.append(
          forecastDateEl,
          fIconEl,
          forecastTempEl,
          fHumityEl,
          fWindEl
        );
        forecastCard.append(forecastBody);
      }
    });
}
handhistorycalData();





// handhistorycalData.addEventListener("click", function(){})
//Add a listener on the search button.
searchFormEl.addEventListener("submit", handleUserInput);

//Add event listener on the button.
document.querySelector(`.buttonbtn`).addEventListener("click", handleSearchForecastData)

