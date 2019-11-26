const express = require('express');
const app = express();
var request = require('request');
var admin = require("firebase-admin");
const serviceAccount = require("./key/accountKey.json"); //GET KEY FILE FROM FIREBASE

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: FIREBASE_DB_URL //exa: https://database.firebaseio.com
});

var db = admin.database().ref(DATABASE_REF_NAME);

var weatherStatus = {};
var cities = ['Istanbul', 'Izmir', 'Ankara'];

const getWeather = (cityName) => {

    var r = request.get('https://api.openweathermap.org/data/2.5/weather?q=' + cityName + ',tr&appid=OPENWEATHERMAP_API_KEY', (err, res, body) => {

        if (err) {
            console.log("Weather Api Error:");
            console.log(err);
        }
        else {

            const json = JSON.parse(body);
            weatherStatus = {
                [cityName]: json.weather[0].main
            }
            updateFirabse(weatherStatus);
            r.abort();
        }
    });

}



const updateFirabse = (array) => {
    db.update(array).then((result) => {
        console.log("Updated Cities");
    }).catch((err) => {
        console.log("ERROR...");
        console.log(err);
    });
}

app.get('/', (req, res) => {
    for (var i = 0; i < cities.length; i++) {
        getWeather(cities[i]);
    }
    res.end();
});

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
    console.log("Server is Listening..." + PORT);
});

