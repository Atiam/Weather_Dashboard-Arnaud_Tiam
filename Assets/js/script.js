const APIKey = "92edb6aeb57f1d6fb00670ba6d93d7a3";
const searchFormEl = document.querySelector(`#search-form`);
const resultCard = document.querySelector(`#current`);
const forecastCard = document.querySelector(`#forecast`);
// forecastCard.("card text-center")


//Get the user input value, also set and alert if the user doesn't enter a value.
function handleUserInput(event) {
  event.preventDefault();
  const cityNameInputval = document.querySelector(`#city-name-input`).value;
  if (cityNameInputval === "") {
    alert("You need a search input value!");
    return;
  }

  // Store previoussearch into the local storage when user make a new research.
  if (cityNameInputval.length) {
    let previoussearch =
      JSON.parse(localStorage.getItem("historicalData")) || [];

    // Check if the city been currently search is not in the previoussearch list.
    // If it is not then push it into that list, other wise don't.
    if (!previoussearch.includes(cityNameInputval)) {
      previoussearch.push(cityNameInputval);
      localStorage.setItem("historicalData", JSON.stringify(previoussearch));
    }
  }

  // handhistorycalData();
  handleSearchForCity(cityNameInputval);
  handleSearchForecastData(cityNameInputval);
}

function handhistorycalData() {
  let previoussearch = JSON.parse(localStorage.getItem("historicalData")) || [];
  //Create card to display historical search
  const displayHistoryEl = document.querySelector("#displayHistory");

  //1- create elements

  for (city of previoussearch) {
    //2-Create contents
    const liEl = document.createElement("button");
    // liEl.setAttribute('class', `button`, `bg-primary`, `p-3`, `mb-2`)
    liEl.classList.add('bg-secondary', `text-white`, `p-3`, `mb-2`, `col-md-11`)
    liEl.textContent = city;
    liEl.addEventListener("click", function () {
      handleSearchForCity(this.textContent);
      handleSearchForecastData(this.textContent);
    });

    displayHistoryEl.append(liEl);
  }

  // Append the elements to the container
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
      resultCard.innerHTML = "";
      // Print the results
      // Display current and future conditions for the city that what searched
      // Need to display: CIty Name, date, icon, temp, humidity, wind
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

      // resultBody.classList.add("card-body");
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
  const queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityNameInputval}&appid=${APIKey}&units=imperial`;

  //Get the weather for 5 next days
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (dataApi) {
      forecastCard.innerHTML = "";

      const forecastTitle = document.createElement("h2");
      forecastTitle.textContent = "5-Day Forecast:";
      const forecastCardsDiv = document.createElement("div");
      forecastCardsDiv.classList.add(`row`, `d-flex`, `justify-content-between`);
      forecastCard.append(forecastTitle, forecastCardsDiv);

      for (let i = 1; i < 41; i += 8) {
        console.log(dataApi.list[i]);
        let date = new Date(dataApi.list[i].dt * 1000);
        console.log(date.toLocaleDateString());

        // Creat cart with the follow data: Date, icon, temp, humidity, wind
        const forecastBody = document.createElement(`div`);
        forecastBody.classList.add(`col-md-2`, `border`, `border-secondary`, `ms-3`, `bg-info`)

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

        // forecastBody.classList.add("card-body ");
        // forecastBody.className = `card-body border-primary d-inline`;
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

        forecastCardsDiv.append(forecastBody);
      }
    });
}

handhistorycalData();

// function getHandlehistorycalData(){
//   storedHistory = localStorage.getItem('historicalData') // depends on what you have named your search history
//   if (storedHistory) {
//       searchHistory = JSON.parse(storedHistory)}
//       handhistorycalData();
//   }

// displayHistoryEl.addEventListener('click', getHandlehistorycalData);

// handhistorycalData.addEventListener("click", function(){})
//Add a listener on the search button.
searchFormEl.addEventListener("submit", handleUserInput);

// //Add event listener on the button.
// document.querySelector(`.buttonbtn`).addEventListener("click", handleSearchForecastData)
