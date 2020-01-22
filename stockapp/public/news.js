$(()=>{

    const apiKey = 'pk_33ba44994cf3468bb0e0aa9487c9b22b'

    const randomNumber = () => {return [makeRandom('0123456789'), makeRandom('0123456789'), makeRandom('0123456789')]};

    const randomSixNumber = () => {return makeRandom('012345')};

    const randomTwoNumber = () => {return makeRandom('012')};

    const makeRandom = (choices) => {return choices.charAt(Math.floor(Math.random() * choices.length))};

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


    const getNews = (stockName) => {
        return new Promise ((resolve, reject) => {
            let data = $.get(`https://cloud.iexapis.com/stable/stock/${stockName}/batch?types=quote,news,chart&range=1m&last=10&token=${apiKey}`)
        
            data.then((res) => {

                // console.log(res['news'])
                resolve(res['news'])
            })
            .catch((err) => {
                console.error(err)
            })
        })
    } 


    $.when(getWatchlist()).then((data) => {

        var stockList = []

        var newsLength = (randomNumber()).length

        for (let stocks of data) {

            let stock = stocks.symbol
            stockList.push(stock)
            
        }

        // console.log(stockList, '<<<< stockList')

        var news = stockList.map(getFeed)

        Promise.all(news).then(function(data) {
            
            console.log(data, '<<<< DATA!!')
            
            const totalLength = (stockList.length) * newsLength
            // console.log(totalLength)
            
            var feed = new Set();

            var count = 0;

            while (count < totalLength) {

                var globalIndex = randomSixNumber()
                var localIndex = randomTwoNumber()
                console.log(globalIndex, localIndex)

                var article = data[globalIndex][localIndex];
                console.log(article, '<<<article')

                feed.add(article)
    
                count ++
            }

            console.log(feed, '<<<<<< FEED')

            for (let news of feed) {

                // console.log(news, '<<< individual news here')

                var headline = news.headline

                var headlineSliced = (news.headline).slice(0, 100)
                // console.log(headline)

                var source = news.source
                // console.log(source)

                var summary = (news.summary).slice(0, 180)
                // console.log(summary)

                var url = news.url
                // console.log(url)

                var image = news.image
                // console.log(image)

                if (headline.length <= headlineSliced.length) {
                    $('#wrapper').append(`<div class="news"><div class="crop"><img src="${image}"></div><h3 class="headline">${headline}</h3><h5 class="source">${source}</h5><p class="summary">${summary}...</p><a href="${url}">Read more...</a></div>`)
                }
                else if (headline.length >= headlineSliced.length) {
                    $('#wrapper').append(`<div class="news"><div class="crop"><img src="${image}"></div><h3 class="headline">${headlineSliced}...</h3><h5 class="source">${source}</h5><p class="summary">${summary}...</p><a href="${url}">Read more...</a></div>`)
                }
            }
        })

                
                
                
                
                
                          
                
                function getFeed(stock) {
                    
                    return new Promise ((resolve, reject) => {

                        let data = $.when(getNews(stock)).then((data) => {
                
                            // console.log(data)
                        
                            const indexes = randomNumber()
                            // console.log(indexes)

                            var output = [data[indexes[0]], data[indexes[1]], data[indexes[2]]]

                            // console.log(output)
                            resolve(output)
            
                        })

                    })
                }
            



    



    })





})