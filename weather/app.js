const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');
const path = require('path');
const { dirname } = require('path');


const POST = 3000;
const app = express();

app.use('/css', express.static(path.join(__dirname + "/html/css")));
app.use(bodyParser.urlencoded({ extended: true }));

var weatherData = "";

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "/html", "index.html"));
});

app.post('/weather', (req, res) => {
    console.log(req.body.cityName);

    const query = req.body.cityName;
    const apiKey = "cde2559701270c589912f9c21f548f07";
    const units = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + units;
    https.get(url, (respond) => {

        respond.on('data', (data) => {
            weatherData = JSON.parse(data);
            const cod = weatherData.cod;
            if (cod == 404) {
                res.write("<h1 style='color: red'>ERROR NO DATA</h1>");
                res.send();
            } else {
                const temp = weatherData.main.temp;
                const weatherDescription = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageIconUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png"
                res.write("<h1 style='color: brown'> Weather </h1>");
                res.write("<h2> The temperature in " + query + " is " + temp + "</h2>");
                res.write("<image src= " + imageIconUrl + "></image>")
                res.send();
            }
        });
    });
});






// app.get('/data', (req, res) => {
//     res.send("<h1>nguyen tien loi" + weatherData.weather + "</h1>");
// })

app.listen(POST);



