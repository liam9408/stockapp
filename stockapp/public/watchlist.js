$(()=>{

    const apiKey = 'pk_33ba44994cf3468bb0e0aa9487c9b22b'
    const tablebody = document.getElementById('watchlistBody')

    const getData = (stockName) => {
        return new Promise ((resolve, reject) => {
            let data = $.get(`https://cloud.iexapis.com/stable/stock/${stockName}/batch?types=quote,news,chart&range=1m&last=10&token=${apiKey}`)
        
            data.then((res) => {
                resolve(res)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    } 

    const getWatchlist = () => {
        return new Promise ((resolve, reject) => {
            let data = $.get(`https://localhost:3030/api/getwatchlist`)
            
            data.then((res) => {
                resolve(res)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

    $.when(getWatchlist()).then(function (data) {

        for (let name of data) {
            // console.log(name.symbol, '<<< name')

            $.when(getData(name.symbol)).then(function (data) {

                // get stock prices            
                let stockPriceLatest = (data['quote']['open']);
                let stockPricePrevious = (data['quote']['previousClose']);
                // console.log(name.symbol, ' CURRENT stock price: ', stockPriceLatest, ' PREVIOUS closing price: ', stockPricePrevious);

                // get price difference 
                let priceChange = (stockPriceLatest - stockPricePrevious).toFixed(2);
                // console.log(priceChange, '<--- PRICE change');

                // get percentage change 
                let percentageChange = ((priceChange/stockPricePrevious) * 100).toFixed(2);
                // console.log(percentageChange, '<--- PERCENTAGE change') 

                if (percentageChange > 0) {
                $(tablebody).append(`<tr class="stock increase"><td class="name"><a href="/stockinfo/${name.symbol}">${name.symbol}</a></td><td class="value">$${stockPriceLatest}</td><td class="change">${priceChange}</td><td class="percentage">+${percentageChange}%</td>`)

                } else if (percentageChange < 0) {
                $(tablebody).append(`<tr class="stock decrease"><td class="name"><a href="/stockinfo/${name.symbol}">${name.symbol}</a></td><td class="value">$${stockPriceLatest}</td><td class="change">${priceChange}</td><td class="percentage">-${percentageChange}%</td>`)
                } 
            })
        }
    })



    // for (let row of stock) {
    //     const symbol = $(row).text();

    //     $.ajax({
    //         url: `https://www.alphavantage.co/query?function=${timeSeries}&symbol=${symbol}&interval=5min&apikey=${apiKey}`,
    //         type: 'GET',
    //         success: function(data){
    //             // var price = data['Time Series (Daily)']['2020-01-17']['4. close']
    //             count++;
    //             console.log(count - 1)
    //             // console.log(price  + symbol)

    //             // get stock prices            
    //             let stockPriceLatest = (data['Time Series (Daily)']['2020-01-17']['4. close']);
    //             let stockPricePrevious = (data['Time Series (Daily)']['2020-01-16']['4. close']);
    //             console.log(symbol, ' CURRENT stock price: ', stockPriceLatest, ' PREVIOUS closing price: ', stockPricePrevious);

    //             // get price difference 
    //             let priceChange = (stockPriceLatest - stockPricePrevious).toFixed(2);
    //             console.log(priceChange, '<--- PRICE change');

    //             // get percentage change 
    //             let percentageChange = ((priceChange/stockPricePrevious) * 100).toFixed(2);
    //             console.log(percentageChange, '<--- PERCENTAGE change') 

    //             if (percentageChange > 0) {
    //             // $('tr').append(`<td class="value">${stockPriceLatest}</td><td class="change">${priceChange}</td><td class="percentage">+${percentageChange}%</td>`)
    //             $('tr').addClass('stock increase').removeClass('stock decrease');
    //             $(value[count - 1]).html(`${stockPriceLatest}`);
    //             $(change[count - 1]).html(`${priceChange}`);
    //             $(percentage[count - 1]).html(`${percentageChange}`);
                    
    //             } else if (percentageChange < 0) {
    //             // $('tr').append(`<td class="value">${stockPriceLatest}</td><td class="change">${priceChange}</td><td class="percentage">-${percentageChange}%</td>`)
    //             $('tr').addClass('stock decrease').removeClass('stock increase');
    //             $(value[count - 1]).html(`${stockPriceLatest}`);
    //             $(change[count - 1]).html(`${priceChange}`);
    //             $(percentage[count - 1]).html(`${percentageChange}`);
    
    //             } 

    //             if(count < stock.length) {
    //                 console.log('here');
    //             }
    //         }
    //     });
    // }
   
    // for (let row of stock) {

    //     console.log(row);

    //     const symbol = $(row).text();
    //     console.log(symbol, '<<<<<<<< symbols');

    //     count ++;
    //     console.log(count, '<<<< this is count');

    //     $.when($.get(`https://www.alphavantage.co/query?function=${timeSeries}&symbol=${symbol}&interval=5min&apikey=${apiKey}`).then(function(data, status){

    //         console.log(symbol, '<<<<< symbol inside AJAX');
    //         console.log(count, '<<<< this is count INSIDE AJAX');

    //         // getting stockname for matching
    //         // let stockName = (data['Meta Data']['2. Symbol']);
    //         // console.log(stockName, '<--- stock name from ajax request')
            
    //         // get stock prices            
    //         let stockPriceLatest = (data['Time Series (Daily)']['2020-01-17']['4. close']);
    //         let stockPricePrevious = (data['Time Series (Daily)']['2020-01-16']['4. close']);
    //         console.log(symbol, ' CURRENT stock price: ', stockPriceLatest, ' PREVIOUS closing price: ', stockPricePrevious);

    //         // get price difference 
    //         let priceChange = (stockPriceLatest - stockPricePrevious).toFixed(2);
    //         console.log(priceChange, '<--- PRICE change');

    //         // get percentage change 
    //         let percentageChange = ((priceChange/stockPricePrevious) * 100).toFixed(2);
    //         console.log(percentageChange, '<--- PERCENTAGE change') 

    //         if (percentageChange > 0) {
    //             // $('tr').append(`<td class="value">${stockPriceLatest}</td><td class="change">${priceChange}</td><td class="percentage">+${percentageChange}%</td>`)
    //             $('tr').addClass('stock increase').removeClass('stock decrease');
    //             $(value[0]).html(`${stockPriceLatest}`);
    //             $(change[0]).html(`${priceChange}`);
    //             $(percentage[0]).html(`${percentageChange}`);
                
    //         } else if (percentageChange < 0) {
    //             // $('tr').append(`<td class="value">${stockPriceLatest}</td><td class="change">${priceChange}</td><td class="percentage">-${percentageChange}%</td>`)
    //             $('tr').addClass('stock decrease').removeClass('stock increase');
    //             $(value[0]).html(`${stockPriceLatest}`);
    //             $(change[0]).html(`${priceChange}`);
    //             $(percentage[0]).html(`${percentageChange}`);
    //         }
    //     }));
    // }












})













// PROBLEM
// it's only getting the last stock price and putting it in value




// var numStocks = 100;
// var stocks = [];
// var alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
// for (i=0; i<=10; i++) {
//   var stock = new Object();
//   stock.name = alphabet[Math.floor((Math.random()*26))] + alphabet[Math.floor((Math.random()*26))]+ alphabet[Math.floor((Math.random()*26))] +alphabet[Math.floor((Math.random()*26))];
//   stock.value = [Math.round(Math.random()*100000)/100];
//   stock.change = [(Math.random()*0.2)-0.1];
//   if(stock.change[0] >= 0) {
//     $('table tbody').append('<tr class="stock increase"><td class="name">'+stock.name+'</td><td class="value">'+stock.value+'</td><td class="change">'+(stock.change[0]*stock.value).toFixed(2)+'</td><td class="percentage">'+(stock.change[0]*100).toFixed(2)+'%</td></tr>');
//   } else {
//     $('table tbody').append('<tr class="stock decrease"><td class="name">'+stock.name+'</td><td class="value">'+stock.value+'</td><td class="change">'+(stock.change[0]*stock.value).toFixed(2)+'</td><td class="percentage">'+(stock.change[0]*100).toFixed(2)+'%</td></tr>');
//   }
//   stocks.push(stock);
// }
// console.log(stocks[50].name);


// get stock name from database
// ajax to get current price
// calculate price change
// calculate percentage




















