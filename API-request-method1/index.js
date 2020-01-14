var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();

var apiKey = 'O00QUABRNGS34O4Z'
var symbol = 'AMZN'

function getStock(){
    let http = new XMLHttpRequest();
    http.open('GET', `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`);

http.onreadystatechange = function () {
    if (http.readyState != XMLHttpRequest.DONE) {
        return;
    } else if (http.status == 200) {
       var data= JSON.parse((http.responseText))
       console.log(data);
    } else {
        console.log('error occurred' + http.status);
    }
}
http.send();
}

getStock()


