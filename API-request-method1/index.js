var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();

var apiKey = 'O00QUABRNGS34O4Z'
var symbol = 'AMZN'

function getStock(){
    let http = new XMLHttpRequest();

    // Calling the API
    http.open('GET', `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=${apiKey}`);

    http.onreadystatechange = function () {
        if (http.readyState !== XMLHttpRequest.DONE) {
            return;
        } 
        else if (http.status === 200) {
        var data = JSON.parse((http.responseText))

        // This will give you metadata about the stock, for example Stock Symbol, Time Zone...
        console.log(data['Meta Data'])

        // This will give you Stock Symbol
        console.log(data['Meta Data']['2. Symbol'])

        // // This will give you Stock Symbol, Time Zone etc
        console.log(data['Time Series (5min)']);

        } 
        else {
            console.log('error occurred' + http.status);
        }
    }
    http.send();
}

getStock()


