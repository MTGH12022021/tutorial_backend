const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const { join } = require('path');


const POST = 3000;
const app = express();

app.use(bodyParser.json());

var weatherData = "";

app.get('/', (req, res) => {
    const url = "https://api.openweathermap.org/data/2.5/weather?q=London&appid=cde2559701270c589912f9c21f548f07#?unit=metric";
    https.get(url, (respond) => {
        //console.log(res);
        respond.on('data', (data) => {
            weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            res.write("<h1 style='color: brown'> Weather </h1>");
            res.write("<h2> The temperature in Lodon is " + temp + "</h2>");
            res.send();
        });
    });
    //res.send("suscessfully")
});

app.get('/data', (req, res) => {
    res.send("<h1>nguyen tien loi" + weatherData.weather + "</h1>");
})

app.listen(POST);



