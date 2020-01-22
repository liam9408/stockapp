const knexConfig = {
    client: 'postgresql',
    connection: { database: 'stockbots', user: 'postgres', password: 'postgres' },
    pool: { min: 2, max: 10 },
    migrations: { tableName: 'knex_migrations' }
  }
const knex = require('knex')(knexConfig);
var XMLHttpRequest = require('xhr2');
var xhr = new XMLHttpRequest();

var apiKey = 'O00QUABRNGS34O4Z'
var symbol = 'AAPL'
// var timeSeries = 'TIME_SERIES_INTRADAY'
var timeSeries = 'TIME_SERIES_DAILY'
// var timeSeries = 'TIME_SERIES_WEEKLY'

// console.log(knexConfig)



// function getStock(){
//     let http = new XMLHttpRequest();

//     // Calling the API
//     http.open('GET', `https://www.alphavantage.co/query?function=${timeSeries}&symbol=${symbol}&interval=5min&apikey=${apiKey}`);

//     http.onreadystatechange = function () {
//         if (http.readyState !== XMLHttpRequest.DONE) {
//             return;
//         } 
//         else if (http.status === 200) {
//         var data = JSON.parse((http.responseText))

//         // This will give you metadata about the stock, for example Stock Symbol, Time Zone...
//         console.log(data['Meta Data'])

//         // This will give you Stock Symbol
//         // console.log(data['Meta Data']['2. Symbol'])

//         // // This will give you Stock Symbol, Time Zone etc
//         // console.log(data['Time Series (5min)']);

//         // // This will give you Stock Symbol, Time Zone etc
//         // console.log(data['Time Series (Daily)']);

//         // var avgPrice = 1880;
//         // var curShares = 1000;
//         // // var curValue = data['Time Series (5min)']['2020-01-13 16:00:00']['4. close']

//         // // With calculation of profit loss
//         // console.log(' -------- Profit/Loss -------- ')

//         // var profLoss = (curValue - avgPrice) * curShares
//         // console.log(profLoss)

//         } 
//         else {
//             console.log('error occurred' + http.status);
//         }
//     }
//     http.send();
// }
class StockService {
    constructor(knex) {
        this.knex = knex;
    }

    addStock (param) {
        return new Promise (async (resolve, reject) => {
            let data = await this.knex('stocks').where({
                symbol: param
            })
            if (data.length === 0) {
                return this.knex('stocks').insert({
                    symbol: param
                })
                .then((res) => {
                    console.log('added', param)
                    resolve('YES')
                })
            }
            else {
                resolve('NO')
            }
        })
    }
}

const test = new StockService(knex);

var newKey = 'pk_33ba44994cf3468bb0e0aa9487c9b22b'

function getStockTwo(){
    let http = new XMLHttpRequest();
    
    // Calling the API
    // http.open('GET', `https://cloud.iexapis.com/stable/stock/SPOT/batch?types=quote,news,chart&range=1m&last=10&token=${newKey}`);

    http.open('GET', `https://cloud.iexapis.com/beta/ref-data/symbols?token=${newKey}`);

    http.onreadystatechange = function () {
        if (http.readyState !== XMLHttpRequest.DONE) {
            return;
        } 
        else if (http.status === 200) {
        var data = JSON.parse((http.responseText))

        // This will give you metadata about the stock, for example Stock Symbol, Time Zone...
        console.log(data[1].symbol)

        for (let stock of data) {
            test.addStock(stock.symbol)
        }


        // This will give you Stock Symbol
        // console.log(data['Meta Data']['2. Symbol'])

        // // This will give you Stock Symbol, Time Zone etc
        // console.log(data['Time Series (5min)']);

        // // This will give you Stock Symbol, Time Zone etc
        // console.log(data['Time Series (Daily)']);

        // var avgPrice = 1880;
        // var curShares = 1000;
        // // var curValue = data['Time Series (5min)']['2020-01-13 16:00:00']['4. close']

        // // With calculation of profit loss
        // console.log(' -------- Profit/Loss -------- ')

        // var profLoss = (curValue - avgPrice) * curShares
        // console.log(profLoss)

        } 
        else {
            console.log('error occurred' + http.status);
        }
    }
    http.send();
}

// getStock()

getStockTwo()




