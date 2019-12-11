'use strict';

// Dependencies 
const PORT = process.env.PORT || 3000;
const express = require('express');
const cors = require('cors');
const app = express();
const superagent = require('superagent');


// dotenv is configuration
require('dotenv').config();

// cors is middleware, we USE middleware
app.use(cors());

app.get('/location', getLocation);
app.get('/weather', getWeather);


//  Request the query input and send the data
function getLocation(request, response){
  console.log(request.query.data);
  superagent.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${request.query.data}&key=${process.env.GEOCODING_API_KEY}`).then(result => {
    const location = new Location (request.query.data, result);
    response.send(location);
    })
    .catch(err => handleError(err, response));
  }
  // const locationData = geoCoord(request.query.data || 'Lynnwood, WA, USA');
  // response.send(locationData);


function getWeather(request, response){
  const weatherData = searchWeather(request.query.data || 'Lynnwood, WA, USA');
  response.send(weatherData);

}



// Constructors for saving the variable
function Location (query, response) {
  this.search_query = query;
  this.formatted_query = response.body.results[0].formatted_address;
  this.latitude = response.body.results[0].geometry.location.lat;
  this.longitude= response.body.results[0].geometry.location.lng;
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
  let weatherArray = darkSkyData.daily.data.map(forecast => (new Daily(forecast)));
  console.log(weatherArray);
  return weatherArray;
}}



// Error Handler
function handleError(err, response) {
  console.log(err);
  if (response) response.status(500).send('Sorry something went wrong');
}



// telling to listen for the PORT and display to ensure that the port is running
app.listen(PORT, () => {
  console.log(`app is running on PORT: ${PORT}`);


});
