$(()=>{

    const apiKey = 'pk_33ba44994cf3468bb0e0aa9487c9b22b'
    const tablebody = document.getElementById('watchlistBody')

    // Declaring all needed functions

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

    // Actual rendering starts

    $.when(getWatchlist()).then(function (data) {

        // for each stock in the user's watchlist, we are fetching data from the api
        for (let name of data) {

            $.when(getData(name.symbol)).then(function (data) {

                // get stock prices            
                let stockPriceLatest = (data['quote']['open']);
                let stockPricePrevious = (data['quote']['previousClose']);

                // get price difference 
                let priceChange = (stockPriceLatest - stockPricePrevious).toFixed(2);

                // get percentage change 
                let percentageChange = ((priceChange/stockPricePrevious) * 100).toFixed(2);

                if (percentageChange > 0) {
                $(tablebody).append(`<tr class="stock increase"><td class="name"><a href="/stockinfo/${name.symbol}">${name.symbol}</a></td><td class="value">$${stockPriceLatest}</td><td class="change">${priceChange}</td><td class="percentage">+${percentageChange}%</td>`)

                } else if (percentageChange < 0) {
                $(tablebody).append(`<tr class="stock decrease"><td class="name"><a href="/stockinfo/${name.symbol}">${name.symbol}</a></td><td class="value">$${stockPriceLatest}</td><td class="change">${priceChange}</td><td class="percentage">-${percentageChange}%</td>`)
                } 
            })
        }
    })
})








