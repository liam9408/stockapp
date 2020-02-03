$(()=>{

    const tablebody = document.getElementById('holdingsBody')
    const apiKey = 'pk_33ba44994cf3468bb0e0aa9487c9b22b'

    // Declaring all needed functions

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

    const getData = (stockName) => {
        return new Promise ((resolve, reject) => {
            let data = $.get("https:/" + "/cloud.iexapis.com/stable/stock/" + stockName + "/batch?types=quote,news,chart&range=1m&last=10&token=" + apiKey)
        
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
            let data = $.get("https:/" + "/harryhindsight.com/api/listportfolio")
            // let data = $.get("https:/" + "/localhost:3030/api/listportfolio")

            data.then((res) => {
                resolve(res)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }


    $.when(getPortfolio()).then((data) => {
        
        // Got a list of user's portfolio
        for (let name of data) {

            const portfolio = name.name
            const id = name.id

            // Get list of stocks under each portfolio
            $.when(listPortfolioStocks(portfolio)).then((data) => {

                for (let symbol of data) {

                    const stock = symbol.stocks_symbol

                    // Getting the market data for each stock
                    $.when(getData(stock)).then((data) => {

                        let stockPriceLatest = data.quote.change;

                        let priceChange = data.quote.change

                        let percentageChange = data.quote.changePercent

                        if (percentageChange > 0) {
                        $(`#${id}`).append(`<tr class="stock increase"><td class="name"><a class="stockName" href="/stockinfo/${stock}">${stock}</a></td><td class="value">$${stockPriceLatest}</td><td class="change">${priceChange}</td><td class="percentage">+${percentageChange}%</td>`)
            
                        } else if (percentageChange < 0) {
                        $(`#${id}`).append(`<tr class="stock decrease"><td class="name"><a class="stockName" href="/stockinfo/${stock}">${stock}</a></td><td class="value">$${stockPriceLatest}</td><td class="change">${priceChange}</td><td class="percentage">-${percentageChange}%</td>`)
                        } 
                    })
                    
                }
                
            })

        }

    })



})