// Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

// App endpoint
let projectData={};

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize client side folder
app.use(express.static('app'));

// GET Route
app.get('/allEntries', function (req, res) {
    res.send(projectData);
});

// POST Route
app.post('/addEntry', addEntry);

function addEntry(req, res){
    console.log(res);

    newEntry = {
        date: req.body.date,
        city: req.body.city,
        weather: req.body.weather,
        temp: req.body.temp,
        feeling: req.body.feeling
    }

    let newKey = Object.keys(projectData).length;

    projectData[newKey] = newEntry;
    res.send(projectData);
}


const port = 8000;
const server = app.listen(port, () => {console.log(`running on localhost: ${port}`)});