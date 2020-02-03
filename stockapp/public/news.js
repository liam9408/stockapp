$(()=>{

    const apiKey = 'pk_33ba44994cf3468bb0e0aa9487c9b22b'

    // Declaring all needed functions

    const randomNumber = () => {return [makeRandom('0123456789'), makeRandom('0123456789'), makeRandom('0123456789')]};

    const randomSixNumber = () => {return makeRandom('012345')};

    const randomTwoNumber = () => {return makeRandom('012')};

    const makeRandom = (choices) => {return choices.charAt(Math.floor(Math.random() * choices.length))};

    const getWatchlist = () => {
        return new Promise ((resolve, reject) => {
            let data = $.get("https:/" + "/harryhindsight.com/api/getwatchlist")
            // let data = $.get("https:/" + "/localhost:3030/api/getwatchlist")
            
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
            let data = $.get("https:/" + "/cloud.iexapis.com/stable/stock/" + stockName + "/batch?types=quote,news,chart&range=1m&last=10&token=" + apiKey)
        
            data.then((res) => {

                // console.log(res['news'])
                resolve(res['news'])
            })
            .catch((err) => {
                console.error(err)
            })
        })
    } 

    // Actual rendering starts
 
    $.when(getWatchlist()).then((data) => {

        // Newsfeed 
        
        // The list of stocks we need to fetch news for
        var stockList = []

        // We are fetching three articles per news
        var newsLength = (randomNumber()).length

        // Adding the stock into the stocklist array
        for (let stocks of data) {

            let stock = stocks.symbol
            stockList.push(stock)
            
        }

        // running the getFeed function to all the stocks in stockList
        var news = stockList.map(getFeed)

        Promise.all(news).then(function(data) {
            
            // Total number of articles we will show
            const totalLength = (stockList.length) * newsLength
            
            // Making sure the articles in the news feed don't repeat themselves
            var feed = new Set();

            var count = 0;

            // As the getFeed promise will return an object containing the news of all the stocks in stockList, 
            // we need numString to be flexible so that it can accommdate a varying watchlist/stockList length
            var numString = '';

            for (var i = 0; i < stockList.length; i++) {
                var num = i.toString();
                numString += num;
            }

            // Return a random number based between 0 and the amount of stocks we are fetching news for
            const randomLength = () => {return makeRandom(numString)};

            // Randomly pushing news articles into our feed set, global index will determine the stock, and local index will determine the article
            while (count < totalLength) {

                var globalIndex = randomLength()
                var localIndex = randomTwoNumber()

                var article = data[globalIndex][localIndex];

                feed.add(article)
    
                count ++
            }

            // For each article in the feed, we append it to the dashboard
            for (let news of feed) {

                var headline = news.headline

                var headlineSliced = (news.headline).slice(0, 100)

                var source = news.source

                var summary = (news.summary).slice(0, 180)

                var url = news.url

                var image = news.image

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
                        
                    const indexes = randomNumber()

                    var output = [data[indexes[0]], data[indexes[1]], data[indexes[2]]]

                    resolve(output)
                })
            })
        }
            



    



    })





})