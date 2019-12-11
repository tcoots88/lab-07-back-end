'use strict';

// Dependencies 
const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const app = express();


// dotenv is configuration
require('dotenv').config();

// cors is middleware, we USE middleware
app.use(cors());

app.get('/location', getLocation);
app.get('/weather', getWeather);


//  Request the query input and send the data
function getLocation(request, response){
  const locationData = geoCoord(request.query.data || 'Lynnwood, WA, USA');
  response.send(locationData);
}

function getWeather(request, response){
  const weatherData = searchWeather(request.query.data || 'Lynnwood, WA, USA');
  response.send(weatherData);

}



// Constructors for saving the variable
function Location (location) {
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude= location.geometry.location.lng;
}



function Daily(dailyForecast){
  this.forecast = dailyForecast.summary;
  this.time = new Date(dailyForecast.time * 1000).toDateString();
}


// functions to pull data from JSON
function geoCoord(query){
  const geoData = require('./data/geo.json');
  const location = new Location(geoData.results[0]);
  return location;
}

function searchWeather(query){{
  let darkSkyData = require('./data/darksky.json');
  console.log(darkSkyData);
  let weatherArray = [];
  darkSkyData.daily.data.forEach(forecast => weatherArray.push(new Daily(forecast)));
  console.log(weatherArray);
  return weatherArray;
}}



// Error Handler
app.get('/*', function(request, response){
  response.status(404).send('Sorry, error 404.  It is not our fault, it is yours')
})



// telling to listen for the PORT and display to ensure that the port is running
app.listen(PORT, () => {
  console.log(`app is running on PORT: ${PORT}`);


});
