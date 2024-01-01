const aqi_messages = [
    {
        band:"Low",
        lowerRange : 1,
        upperRange : 3,
        mssg_atRiskIndividual: "Enjoy your usual outdoor activities.",
        mssg_general : "Enjoy your usual outdoor activities."
    },
    {
        band:"Moderate",
        lowerRange:4,
        upperRange:6,
        mssg_atRiskIndividual : "Adults and children with lung problems, and adults with heart problems, who experience symptoms, should consider reducing strenuous physical activity, particularly outdoors.",
        mssg_general: "Enjoy your usual outdoor activities."
    },
    {
        band:"High",
        lowerRange:7,
        upperRange:9,
        mssg_atRiskIndividual : "Adults and children with lung problems, and adults with heart problems, should reduce strenuous physical exertion, particularly outdoors, and particularly if they experience symptoms. People with asthma may find they need to use their reliever inhaler more often. Older people should also reduce physical exertion.",
        mssg_general: "Anyone experiencing discomfort such as sore eyes, cough or sore throat should consider reducing activity, particularly outdoors."
    },
    {
        band:"Very High",
        lowerRange:10,
        upperRange:10,
        mssg_atRiskIndividual : "Adults and children with lung problems, adults with heart problems, and older people, should avoid strenuous physical activity. People with asthma may find they need to use their reliever inhaler more often.",
        mssg_general: "Reduce physical exertion, particularly outdoors, especially if you experience symptoms such as cough or sore throat."
    }
]
    
function fetchData(location){
    const url = `https://api.weatherapi.com/v1/current.json?key=5abea22eae1642b881b92504230112&q=${location}&aqi=yes`;
    console.log(url);
    fetch(url, {mode: "cors"})
        .then(function(response){

            if(response.ok){
                return response.json();
            }
            else{
                throw new Error("location '"+location+"' Not Found");
            }
            
        }).then(function(response){
            console.log(response);
            const data = processData(response);
            displayData(data);
        }).catch(error => {
            alert(error);
        });
}
function processData(data){
    const temp = data.current.temp_c;
    const aqi = data.current.air_quality["gb-defra-index"];
    const type_weather = data.current.condition["text"];
    const iconLink = data.current.condition["icon"];
    const location = data.location;
    let aqi_data = "";
    for(key of aqi_messages){
        if(aqi<=key.upperRange && aqi>=key.lowerRange){
            aqi_data = key;
            break; 
        }
    }
    return {temp, aqi, type_weather, iconLink, aqi_data, location};
}
function displayData(object){
    const icon = document.querySelector(".icon-container img");
    const tempDiv = document.querySelector(".temp");
    const textDiv = document.querySelector(".text");
    icon.src = object.iconLink;
    tempDiv.innerHTML =`<span>${object.temp} &deg;C</span>`;
    textDiv.textContent = object.type_weather;

    const region = document.querySelector(".region");
    const country = document.querySelector(".country");
    region.textContent = object.location.name;
    country.textContent = object.location.country;
    
    const bandDiv = document.querySelector(".band span");
    const mssgDiv = document.querySelector(".mssg span");
    bandDiv.textContent = object.aqi_data["band"];
    mssgDiv.textContent = object.aqi_data["mssg_general"];

    const weather_report = document.querySelector(".weather-data-container");
    const initial_mssg = document.querySelector(".initial-mssg");
    initial_mssg.style.display = "none";
    weather_report.style.display = "grid";
}

function main(){
    const fetchBttn = document.querySelector(".fetch");
    fetchBttn.addEventListener("click", (e)=>{
        e.preventDefault();
        const locationInput = document.querySelector(".location");
        const error_mssg = document.querySelector(".location-error-mssg");
        if(locationInput.validity.valueMissing){
            error_mssg.style.display = "block";
        }
        else{
            error_mssg.style.display = "none";
            fetchData(locationInput.value);
        }
    })
    
}
main();


