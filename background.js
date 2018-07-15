const GoogleImages = require('google-images');
const axios = require('axios');
const key = require('./key');
const client = new GoogleImages(key.cx, key.apiKey);


module.exports = async function (place) {
    try{
        const res = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${place}&appid=e180950ec0ef5edb3bb4bdfbc69710ef&units=metric`);
        const weather = {
            des: res.data.weather[0].main,
            temp: res.data.main.temp,
            icon: res.data.weather[0].icon
        }
        
        const imgs = await client.search(`${place} ${weather.des}`);
        return {weather, img: imgs[0]};
    }
    catch(e) {
        return {weather, img: ''};
    }
}