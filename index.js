const http = require("http");
const fs = require("fs");
const request = require('requests');

const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempVal%}", (orgVal.main.temp -273).toFixed(2));
    temperature = temperature.replace("{%temp_min%}", (orgVal.main.temp_min - 273).toFixed(2));
    temperature = temperature.replace("{%temp_max%}", (orgVal.main.temp_max -273).toFixed(2));
    temperature = temperature.replace("{%location%}",orgVal.name);
    temperature = temperature.replace("{%country%}",orgVal.sys.country);
    temperature = temperature.replace("{%tempStatus%}",orgVal.weather[0].main);
    
    return temperature;
}

const homeFile = fs.readFileSync("weather.html", "utf-8");

const server = http.createServer((req, res) => {
    
    if(req.url == "/"){
        request("https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=9e21429c82ef86be8ca82b0d0d2bb546")
        .on("data", (chunk) => {
            const objData = JSON.parse(chunk);
            const arrData = [objData];
            const realTimeData = arrData.map(value => replaceVal(homeFile, value)).join('');
            res.write(realTimeData);
        })
        .on("error", (err) => {
            if(err) return console.log("connection closed due to errors", err);
            res.end();
        })
    }
    console.log(req.url);
});

server.listen(process.env.PORT || 3080,() => console.log("listening on http://localhost:3080")
);