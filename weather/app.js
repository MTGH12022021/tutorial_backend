const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const { join } = require('path');


const POST = 3000;
const app = express();

app.use(bodyParser.json());

var weatherData = "";

app.get('/', (req, res) => {
    const query = "HaNoi";
    const apiKey = "cde2559701270c589912f9c21f548f07";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;
    const units = "metric";
    https.get(url, (respond) => {
        //console.log(res);
        respond.on('data', (data) => {
            weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageIconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
            res.write("<h1 style='color: brown'> Weather </h1>");
            res.write("<h2> The temperature in "+ query +" is " + temp + "</h2>");
            res.write("<image src= " + imageIconUrl+ "></image>")
            res.send();
        });
    });
    //res.send("suscessfully")
});

app.get('/data', (req, res) => {
    res.send("<h1>nguyen tien loi" + weatherData.weather + "</h1>");
})

app.listen(POST);



