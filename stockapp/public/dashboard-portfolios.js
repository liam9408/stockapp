$(()=>{

    const tablebody = document.getElementById('portfolioBody')
    const apiKey = 'pk_33ba44994cf3468bb0e0aa9487c9b22b'

    function add(accumulator, a) {
        return accumulator + a;
    }

    const getPortfolio = () => {
        return new Promise ((resolve, reject) => {
            let data = $.get(`https://localhost:3030/api/listportfolio`)

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
            let data = $.get(`https://cloud.iexapis.com/stable/stock/${stockName}/batch?types=quote,news,chart&range=1m&last=10&token=${apiKey}`)
        
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
            let data = $.get(`https://localhost:3030/api/portfoliostocks/${portfolio}`)
        
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
            let data = $.get(`https://localhost:3030/api/currentshares/${portfolio}/${stock}`)
        
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
            let data = $.get(`https://localhost:3030/api/averageprice/${portfolio}/${stock}`)

            data.then((res) => {
                resolve(res)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

  

    $.when(getPortfolio()).then(function (data) {

        for (let name of data) {
            
            const portfolio = name.name
            
            $.when(listPortfolioStocks(portfolio)).then(function (data) {
                
                var stockList = [];

                for (let stock of data) {
                    const stockName = stock.stocks_symbol
                    stockList.push(stockName)
                }

                // console.log(stockList, '<<<< stock in ', portfolio)

                var value = stockList.map(dash)    
                // console.log(value, 'this is value of ', portfolio)

                Promise.all(value).then(function(data) {

                    // console.log(data)

                    var output = (data.reduce(add)).toFixed(2)
                    // console.log(output, 'this is output')

                    if (output > 0) {
                        $(tablebody).append(`<tr class="stock increase"><td class="name">${portfolio}</td><td id='test' class="change">${output}</td>`)
                    }
                    else if (output < 0) {
                        $(tablebody).append(`<tr class="stock decrease"><td class="name">${portfolio}</td><td id='test' class="change">${output}</td>`)
                    }
                })
        
                function dash (stock) {
                    
                    return new Promise ((resolve, reject) => {

                        let data = $.when(getCurrentShares(portfolio, stock)).then(function (data) {

                            const currentShares = data
                            // console.log(currentShares, '<<<< current shares of ', stock, ' in ', portfolio)
    
                            $.when(getCurrentPrice(stock)).then(function (data) {
    
                                const currentPrice = data;
                                // console.log(currentPrice, '<<<< current price of ', stock)
                                
                                $.when(getAveragePrice(portfolio, stock)).then(function (data) {
                                    
                                    const averagePrice = data;
                                    // console.log(averagePrice, '<<<< average price of ', stock)
                                    
                                    const stockProLos = ((currentPrice - averagePrice) * currentShares)
                                    // console.log(stockProLos, '<<<<<< this is the performance of ', stock, ' from ', portfolio)

                                    resolve(stockProLos);
                                    // return stockProLos

                                })
                            })
                        })
                    })
                }
            })
        }
    })
})