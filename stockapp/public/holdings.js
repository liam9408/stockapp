$(()=>{

    const tablebody = document.getElementById('holdingsBody')
    const apiKey = 'pk_33ba44994cf3468bb0e0aa9487c9b22b'

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


    $.when(getPortfolio()).then((data) => {

        for (let name of data) {

            const portfolio = name.name
            const id = name.id
            // console.log(portfolio, '<<<< portfolio name and ', id)

            $.when(listPortfolioStocks(portfolio)).then((data) => {

                for (let symbol of data) {

                    const stock = symbol.stocks_symbol
                    // console.log(stock, '<<<< current stock of ', portfolio)

                    $.when(getData(stock)).then((data) => {

                        let stockPriceLatest = (data['quote']['open']);
                        let stockPricePrevious = (data['quote']['previousClose']);

                        // console.log(stockPriceLatest, '<<< latest price of ', stock, ' in ', portfolio)
                        // console.log(stockPricePrevious, '<<< previous closing price of ', stock, ' in ', portfolio)

                        let priceChange = (stockPriceLatest - stockPricePrevious).toFixed(2)

                        let percentageChange = ((priceChange/stockPricePrevious) * 100).toFixed(2);

                        if (percentageChange > 0) {
                        $(`#${id}`).append(`<tr class="stock increase"><td class="name"><a href="/stockinfo/${stock}">${stock}</a></td><td class="value">$${stockPriceLatest}</td><td class="change">${priceChange}</td><td class="percentage">+${percentageChange}%</td>`)
            
                        } else if (percentageChange < 0) {
                        $(`#${id}`).append(`<tr class="stock decrease"><td class="name"><a href="/stockinfo/${stock}">${stock}</a></td><td class="value">$${stockPriceLatest}</td><td class="change">${priceChange}</td><td class="percentage">-${percentageChange}%</td>`)
                        } 
                    })
                    
                }
                // console.log('break')
                
            })

        }

    })



})