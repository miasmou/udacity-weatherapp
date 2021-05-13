// Personal API Key for OpenWeatherMap API
const apiKey = "&appid=827ebfb15db96930699ac7a161159fa7";
// URL for calling the API
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const units = "&units=metric";

const zipInput = document.getElementById('zip');
const feelingInput = document.getElementById('feelings');
const entryHolder = document.getElementById('entryHolder');
const entryDate = document.getElementById('date');
const entryTemp = document.getElementById('temp');
const entryContent = document.getElementById('content');
const entryEmptyPlaceholder = document.getElementById('emptyPlaceholder');

/* Function called by event listener */
const submitEntry = () => { 
    //Get today's date
    const date = new Date();
    //Format it in a user-friendly way
    const formattedDate = date.toDateString();

    // Capture value of textarea before clearing it
    const userFeeling = feelingInput.value;

    getWeatherAtCity(baseURL, zipInput.value)
    .then(function(data){
        postEntry('/addEntry', {date: formattedDate, city: data.name, weather: data.weather, temp: data.main.temp, feeling: userFeeling})
        .then(
            getEntries('/allEntries')    
        )
    })

    //Clear inputs
    zipInput.value = null;
    feelingInput.value = null;
}

/* GET Weather info */
const getWeatherAtCity = async (baseURL, city) => {
    const url = baseURL + city + apiKey + units;
    const result = await fetch(url)
    try{
        const data = await result.json();  
        return data;
    } catch(error){
        console.log('error', error);
    }
}

/* POST Weather info + date + feeling to app */
const postEntry = async (url, data) => {
    const result = await fetch(url, {
        method:'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type' : 'application/json',
        },
        body: JSON.stringify(data),
    });
    try{
        const newData = await result.json();
        return newData;
    } catch(error){
        console.log('error', error);
    }
}

/* GET All app Entries */
const getEntries = async (url) => {
    const result = await fetch(url)
    try{
        const entries = await result.json();
        console.log(entries);
        displayEntry(entries);
    } catch(error){
        console.log('error', error);
    }
}

/* Update UI with entries */
const displayEntry = (entry) => {
    if(entry.length == 0){
        // Empty state if no entries
        entryHolder.style.display = "none";
        entryEmptyPlaceholder.style.display = "block";
    } else{
        entryHolder.style.display = "block";
        entryEmptyPlaceholder.style.display = "none";
        // Add elements with text data
        entryDate.innerHTML = `<h3>${entry.date}</h3>`;
        entryTemp.innerHTML = `<p>${entry.temp}</p>`;
        entryContent.innerHTML = `<p>${entry.feeling}</p>`;
    }
}

// Get Entries on start
getEntries('/allEntries');

// Event listener to add function to button
document.getElementById("generate").addEventListener("click", submitEntry);

