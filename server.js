'use strict';

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



function getLocation(request, response){
  const locationData = geoCoord(request.query.data || 'Lynnwood, WA, USA');
  response.send(locationData);
}

function getWeather(request, response){
  const weatherData = searchWeather(request.query.data || 'Lynnwood, WA, USA');
  response.send(weatherData);

}


function Location (location) {
  this.formatted_query = location.formatted_address;
  this.latitude = location.geometry.location.lat;
  this.longitude= location.geometry.location.lng;
}



function Daily(dailyForecast){
  this.forecast = dailyForecast.summary;
  this.time = new Date(dailyForecast.time * 1000).toDateString();
}



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
  response.status(404).send('Sorry')
})




app.listen(PORT, () => {
  console.log(`app is running on PORT: ${PORT}`);


});
