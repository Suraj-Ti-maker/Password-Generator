const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially varibles need??
let oldTab = userTab;
const API_KEY = "0ad1d9084a6b4e888c784942252708";
currentTab.classList.add("current-tab");

function switchTab(newTap){
    if(newTab!=oldTab){
        oldTab.classList.remove("current-tab");
        oldTab=newTap;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();
        }

    }
}
userTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    //pass clicked tab as input parameter
    switchTab(searchTab);
});
// check if coordinates are already present in seesion storage
function  getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        //agar local coordinates nhi mila
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }

}
async function fetchUserWeatherInfo(){
    const {lat,lon} = coordinates;
    // make grant container invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //API call
    try {
         let response =fetch('https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}');
         const data = await response.json();
         loadingScreen.classList.remove("active");
         userInfoContainer.classList.add("active");
         renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");
        //hw
    }
 }

 function renderWeatherInfo(weatherInfo){
    const cityNmae=document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-counteryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    //fetch values from weather info object and put it ui elements
    cityNmae.innerText = weatherInfo?.name;
    countryIcon.src = 'https://flagcdn.com/144×108/${weatherInfo?.sys?.countery.toLowerCase()}.png';
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = 'https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png';
    temp.innerText = '${weatherInfo?.main?.temp} °C';
    windspeed.innerText = '${weatherInfo?.wind?.speed} m/s';
    humidity.innerText = '${weatherInfo?.main?.humidity} %';
    cloudiness.innerText = '${weatherInfo?.clouds?.all}%';
 }

 function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //hw -> show an alert for no geolocation
    }
 }
 function showPosition(){

    const userCoordinates = {
        lat: Position.coords.latitude,
        lon: Position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
 }

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click",getLocation)

const searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    let cityName = searchInput.ariaValueMax;
    if(cityName=="")
        return;
    else
        fetchUserWeatherInfo(cityName);

})
async function fetchUserWeatherInfo(city) {
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}');
const data= await response.json();
loadingScreen.classList.remove("active");
userInfoContainer.classList.add("active");
renderWeatherInfo(data);
    } 
    catch(err){

    }
    
}
