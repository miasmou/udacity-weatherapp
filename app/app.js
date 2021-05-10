// Personal API Key for OpenWeatherMap API
const apiKey = "&appid=827ebfb15db96930699ac7a161159fa7";
// URL for calling the API
const baseURL = "https://api.openweathermap.org/data/2.5/weather?zip=";
const units = "&units=metric";

const zipInput = document.getElementById('zip');
const feelingInput = document.getElementById('feelings');
const entriesContainer = document.getElementById('entriesContainer');

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
        displayEntries(entries);
    } catch(error){
        console.log('error', error);
    }
}

/* Update UI with entries */
const displayEntries = (entries) => {
    const fragment = document.createDocumentFragment();
    entriesContainer.innerHTML = null;
    if(entries.length == 0){
        // Empty state if no entries
        createElementWithText(entriesContainer, 'p', "No entries to display", 'entries__placeholder');
    } else{
        // Iterate through entries in object and build entry element for each
        Object.keys(entries).forEach(key=>{
            // Build out entry structure
            const newEntryContainer = document.createElement('div');
            newEntryContainer.classList.add('entryHolder');
            const newEntryDate = document.createElement('div');
            newEntryDate.classList.add('date');
            const newEntryTemp = document.createElement('div');
            newEntryTemp.classList.add('temp');
            const newEntryContent = document.createElement('div');
            newEntryContent.classList.add('content');
    
            // Add elements with text data
            createElementWithText(newEntryContainer, 'h3', entries[key].city, 'entry__header');
            createElementWithText(newEntryDate, 'p', entries[key].date, 'entry__date');
            createElementWithText(newEntryTemp, 'p', "Weather: " + entries[key].weather[0].main, 'entry__weather');
            createElementWithText(newEntryTemp, 'p', "Temperature: " + entries[key].temp +'°C', 'entry__temp');
            createElementWithText(newEntryContent, 'p', "You were feeling: " + entries[key].feeling, 'entry__feeling');
    
            newEntryContainer.appendChild(newEntryDate);
            newEntryContainer.appendChild(newEntryTemp);
            newEntryContainer.appendChild(newEntryContent);
            fragment.appendChild(newEntryContainer);
         });
        entriesContainer.appendChild(fragment);
    }
}

// Utility function to create elements with text inside and a custom class
const createElementWithText = (container, type, innerText, classToAdd) => {
    // Create element
    const elementToCreate = document.createElement(type);
    // Set inside text
    elementToCreate.innerText = innerText;
    // Add appropriate classes
    elementToCreate.classList.add(classToAdd);
    // Append to container
    container.appendChild(elementToCreate);
}

// Get Entries on start
getEntries('/allEntries');

// Event listener to add function to button
document.getElementById("generate").addEventListener("click", submitEntry);

