$(()=>{

    const tablebody = document.getElementById('portfolioBody')
    const apiKey = 'pk_33ba44994cf3468bb0e0aa9487c9b22b'

    // Declaring needed functions

    function add(accumulator, a) {
        return accumulator + a;
    }

    const getPortfolio = () => {
        return new Promise ((resolve, reject) => {
            // let data = $.get("https:/" + "/harryhindsight.com/api/listportfolio")
            let data = $.get("https:/" + "/localhost:3030/api/listportfolio")

            data.then((res) => {
                resolve(res)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

    const getCurrentPrice = (stockName) => {
        return new Promise ((resolve, reject) => {
            let data = $.get("https:/" + "/cloud.iexapis.com/stable/stock/" + stockName + "/batch?types=quote,news,chart&range=1m&last=10&token=" + apiKey)
        
            data.then((res) => {
                resolve(res['quote']['close'])
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

    const listPortfolioStocks = (portfolio) => {
        return new Promise ((resolve, reject) => {
            let data = $.get("https:/" + "/harryhindsight.com/api/portfoliostocks/" + portfolio)
            // let data = $.get("https:/" + "/localhost:3030/api/portfoliostocks/" + portfolio)
        
            data.then((res) => {
                resolve(res)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

    const getCurrentShares = (portfolio, stock) => {
        return new Promise ((resolve, reject) => {
           let data = $.get("https:/" + "/harryhindsight.com/api/currentshares/" + portfolio + "/" + stock)
            // let data = $.get("https:/" + "/localhost:3030/api/currentshares/" + portfolio + "/" + stock)
        
            data.then((res) => {
                resolve(res)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

    const getAveragePrice = (portfolio, stock) => {
        return new Promise ((resolve, reject) => {
            let data = $.get("https:/" + "/harryhindsight.com/api/averageprice/" + portfolio + "/" + stock)
            // let data = $.get("https:/" + "/localhost:3030/api/averageprice/" + portfolio + "/" + stock)


            data.then((res) => {
                resolve(res)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

  

    // Actual render begins

    $.when(getPortfolio()).then(function (data) {

        // Got a list of user's portfolio
        for (let name of data) {
            
            const portfolio = name.name

            // Get list of stocks under each portfolio
            $.when(listPortfolioStocks(portfolio)).then(function (data) {
                
                var stockList = [];

                // Pushing these stocks into an array
                for (let stock of data) {
                    const stockName = stock.stocks_symbol
                    stockList.push(stockName)
                }

                // A function that will replace each stock'name with the profit and loss it's making
                var value = stockList.map(dash)    

                Promise.all(value).then(function(data) {

                    var output = (data.reduce(add)).toFixed(2)

                    if (output > 0) {
                        $(tablebody).append(`<tr class="stock increase"><td class="name">${portfolio}</td><td id='test' class="change">${output}</td>`)
                    }
                    else if (output < 0) {
                        $(tablebody).append(`<tr class="stock decrease"><td class="name">${portfolio}</td><td id='test' class="change">${output}</td>`)
                    }
                })
        
                // This function will take a stock name and calculate the user's profit and loss of that stock 
                function dash (stock) {
                    
                    return new Promise ((resolve, reject) => {

                        // Each of these fucntions will calculate and return the needed value from the backend
                        let data = $.when(getCurrentShares(portfolio, stock), getCurrentPrice(stock), getAveragePrice(portfolio, stock)).then(function (CurrentShares, CurrentPrice, AveragePrice) {

                            const currentShares = CurrentShares
        
                            const currentPrice = CurrentPrice;
                                                                    
                            const averagePrice = AveragePrice;

                            // This is how you calculate a stock's performance
                            const stockProLos = ((currentPrice - averagePrice) * currentShares)

                            resolve(stockProLos);

                        })
                    })
                }
            })
        }
    })
})