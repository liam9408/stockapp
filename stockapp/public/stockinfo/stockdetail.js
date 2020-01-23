$(()=>{

    const apiKey = 'pk_33ba44994cf3468bb0e0aa9487c9b22b'
    
    // Charts
    const stockName = document.getElementById('stockName')
    const stock = $(stockName).text()
    const addDates = document.getElementById('adddates')
    const removeDates = document.getElementById('removedates')
    const oneMonth = document.getElementById('oneMonth')
    const fiveDays = document.getElementById('fiveDays')

    // Stock Data
    const currentPrice = document.getElementById('currentPrice')
    const companyName = document.getElementById('companyName')
    const primaryExchange = document.getElementById('primaryExchange')
    const latestTime = document.getElementById('latestTime')
    const openPrice = document.getElementById('openPrice')
    const openTime = document.getElementById('openTime')
    const closePrice = document.getElementById('closePrice')
    const closeTime = document.getElementById('closeTime')
    const high = document.getElementById('high')
    const low = document.getElementById('low')
    const previousClose = document.getElementById('previousClose')
    const change = document.getElementById('change')
    const changePercentage = document.getElementById('changePercentage')
    const marketCap = document.getElementById('marketCap')
    const peRatio = document.getElementById('peRatio')
    const high52 = document.getElementById('52High')
    const low52 = document.getElementById('52Low')
    const marketOpen = document.getElementById('marketOpen')

    // News
    const newsArea = document.getElementById('newsArea')

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

    const test = (stockName) => {
        return new Promise ((resolve, reject) => {
            let data = $.get(`https://cloud.iexapis.com/stable/stock/${stockName}/chart/max?&token=${apiKey}`)
        
            data.then((res) => {
                resolve(res)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    } 

    $.when(getData(stock)).then((data) => {

        // Stock detail info

        $(currentPrice).html(`$${data.quote.close}`)
        $(companyName).html(data.quote.companyName)
        $(primaryExchange).html(data.quote.primaryExchange)
        $(latestTime).html(data.quote.latestTime)
        $(openPrice).html(`$${data.quote.open}`)
        $(high).html(`$${data.quote.high}`)
        $(low).html(`$${data.quote.low}`)
        $(previousClose).html(`$${data.quote.previousClose}`)
        
        if (data.quote.change > 0) {
            $(change).addClass('increase')
            $(changePercentage).addClass('increase')
            $(closePrice).addClass('increase')
            $(openPrice).addClass('increase')
            $(currentPrice).addClass('increase')
        } else {
            $(change).addClass('decrease')
            $(changePercentage).addClass('decrease')
            $(closePrice).addClass('decrease') 
            $(openPrice).addClass('decrease')
            $(currentPrice).addClass('decrease')
        }

        $(change).html(data.quote.change)
        $(changePercentage).html(`${data.quote.changePercent}%`)
        $(closePrice).html(`$${data.quote.close}`)

        var open = new Date(data.quote.openTime)
        var close = new Date(data.quote.closeTime)

        $(openTime).html(open)
        $(closeTime).html(close)

        var marCap = (data.quote.marketCap).toString()

        if (marCap.length === 13) {
            $(marketCap).html(`${marCap[0]}.${marCap[1]}Tr`)
        } else if (marCap.length === 12) {
            $(marketCap).html(`${marCap[0]}${marCap[1]}${marCap[2]}.${marCap[3]}Bn`)
        } else if (marCap.length === 11) {
            $(marketCap).html(`${marCap[0]}${marCap[1]}.${marCap[2]}Bn`)
        } else if (marCap.length === 10) {
            $(marketCap).html(`${marCap[0]}.${marCap[1]}Bn`)
        } else if (marCap.length === 9) {
            $(marketCap).html(`${marCap[0]}${marCap[1]}${marCap[2]}Mn`)
        } else if (marCap.length === 8) {
            $(marketCap).html(`${marCap[0]}${marCap[1]}Mn`)
        }

        $(peRatio).html(data.quote.peRatio)
        $(high52).html(`$${data.quote.week52High}`)
        $(low52).html(`$${data.quote.week52Low}`)

        if (data.quote.isMarketOpen === false) {
            $(marketOpen).html('No')
            $(marketOpen).addClass('decrease')
        } else {
            $(marketOpen).html('Yes')
            $(marketOpen).addClass('increase')
        }

        // Drawing Chart

        const charts = data.chart
        var coordinates = []
        var dates = []

        for (let entry of charts) {
            coordinates.push(entry.close)
        }

        for (var i = charts.length - 5; i < charts.length; i++) {
            dates.push(charts[i].date)
        }

        var Max = (Math.max(...coordinates))
        var Min = (Math.min(...coordinates))

        var yMax = Math.round(Max + (Max * 0.05))
        var yMin = Math.round(Min - (Min * 0.05))

        var ctx = document.getElementById('myChart');
        var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Stock Price',
                fill: false,
                data: coordinates,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            max: yMax,
                            min: yMin,
                            suggestedMin: 230,
                            suggestedMax: 350
                        }
                    }]
                }
            }
        });


        // Change to five days mode
        $(fiveDays).on('click', (event) => {

            myChart.data.datasets[0].data = []
            myChart.data.labels = []

            for (var i = charts.length - 5; i < charts.length; i++) {
                // coordinates.push(entry.close)
                myChart.data.datasets[0].data.push(charts[i].close)
                myChart.data.labels.push(charts[i].date)
            }
            
            myChart.update()

        })

        // Change to one month mode
        $(oneMonth).on('click', (event) => {

            myChart.data.datasets[0].data = []
            myChart.data.labels = []

            for (var i = charts.length - 18; i < charts.length; i++) {
                // coordinates.push(entry.close)
                myChart.data.datasets[0].data.push(charts[i].close)
                myChart.data.labels.push(charts[i].date)
            }

            myChart.update()

        })

        // News

        var news = data.news

        for (let article of news) {
            var headline = article.headline
            var source = article.source
            var summary = article.summary
            var summarySliced = (article.summary).slice(0, 180)
            var url = article.url
            var image = article.image
            var date = new Date(article.datetime)

            if (summary.length > 180) {
                $(newsArea).append(`
                <div class="newsBlock">
                <div class="detailCrop">
                    <img src="${image}">
                </div>
                <div class="texts">
                    <a href="${url}">
                        <h4 class="newsHeadline">${headline}</h4>
                    </a>
                    <div class="publisher">
                        <h5 class="source">${source}</h5>
                        <div id="spacer"></div>
                        <h5 class="dateTime">${date}</h5>
                    </div>
                    <h5 class="summary">${summarySliced}...</h5>
                </div>
            </div>`)
            } else {
                $(newsArea).append(`
                <div class="newsBlock">
                <div class="detailCrop">
                    <img src="${image}">
                </div>
                <div class="texts">
                    <a href="${url}">
                        <h4 class="newsHeadline">${headline}</h4>
                    </a>
                    <div class="publisher">
                        <h5 class="source">${source}</h5>
                        <div id="spacer"></div>
                        <h5 class="dateTime">${date}</h5>
                    </div>
                    <h5 class="summary">${summary}</h5>
                </div>
            </div>`)}
        }

    })
 
})