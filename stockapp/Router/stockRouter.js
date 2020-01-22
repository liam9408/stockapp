// Require the necessary modules for this file. 
const express = require('express');

// Setup a StockRouter class which takes the note service as a dependency, that was we can inject the NoteService when we use our Router. As this is not a hard coded value we will need to inject the noteService for every instance of the note router.
class StockRouter {
    constructor(stockService) {
        this.stockService = stockService;
    }

    router () {
        let router = express.Router();
        router.get('/', this.get.bind(this));
        // router.get('/:email', this.testFunction.bind(this)); 
        router.get('/listallstocks', this.listAllStocks.bind(this));
        router.get('/getwatchlist', this.getWatchlist.bind(this));
        router.post('/addwatchlist/:stock', this.addWatchlist.bind(this));
        router.delete('/delwatchlist/:stock', this.delWatchlist.bind(this));
        router.get('/listportfolio', this.listPortfolio.bind(this));
        router.post('/addportfolio/:portfolio', this.addPortfolio.bind(this));
        router.delete('/delportfolio/:portfolio', this.delPortfolio.bind(this));
        router.post('/transactions/:stock/:portfolio/:action/:amount/:price', this.post.bind(this));
        router.get('/currentshares/:portfolio/:stock', this.getCurrentShares.bind(this));
        router.get('/portfoliostocks/:portfolio', this.listPortfolioStocks.bind(this));
        router.get('/averageprice/:portfolio/:stock', this.getAveragePrice.bind(this));
        // router.put('/', this.post.bind(this));
        // router.delete('/', this.post.bind(this));
        return router
    }

    // testFunction(req, res) {
    //     this.stockService.getPortfolio(req.params.email).then((data) => {
    //         res.json(data)
    //     })
    //     .catch((err) => res.status(500).json(err));
    // }
    
    get(req, res) {
        console.log('get')
        return this.stockService.listAllStocks()
        .then((stocks) => {
            // console.log(stocks)
            res.json(stocks)
        })
        .catch((err) => res.status(500).json(err));
    };
    
    // user add buy/sell records of stock
    post(req, res) {
        // checkes if the stockcode is already in database, if not, add the stock to our database, if yes, allows user to add new entry to stock portfolio
        this.stockService.addStock(req.params.stock).then((data) => {
            console.log('POST')
            // pass portfolio name to get portfolio ID
            this.stockService.getPortfolioID(req.params.portfolio).then((data) => {
                var porfId = data
                
                // finally adding the transaction into our database
                return this.stockService.addBuy(porfId, req.params.stock, req.session.passport.user.id, req.params.action, req.params.amount, req.params.price)
                .then(() => res.redirect('back'))
                .catch((err) => res.status(500).json(err));
            })
        })
    };

    listAllStocks(req, res) {
        return this.stockService.listAllStocks()
        .then((stocks) => {
            res.json(stocks)
        })
        .catch((err) => {
            res.status((500).json(err))
        });
    };

    // listing out stocks in watchlist for front end rendering
    getWatchlist(req, res) {
        return this.stockService.listWatchlist(req.session.passport.user.email)
        .then((stocks) => {
            // console.log(stocks)
            res.json(stocks)
        })
        .catch((err) => res.status(500).json(err));
    };
    
    // add stock to watchlist
    addWatchlist(req, res) {
        // checkes if the stockcode is already in database, if not, add the stock to our database, if yes, allows user to add new entry to stock portfolio
        this.stockService.addStock(req.params.stock).then((data) => {
            return this.stockService.addWatchlist(req.session.passport.user.id, req.params.stock)
                .then(() => res.redirect('back'))
                .catch((err) => res.status(500).json(err));
        })
    }

    // delete stock from watchlist
    delWatchlist(req, res) {
        return this.stockService.delWatchlist(req.session.passport.user.id, req.params.stock).then(() => {
            console.log('deleted ', stock, ' from watchlist')
            res.redirect('back')
        })
        .catch((err) => res.status(500).json(err))    
    }

    // list portfolio
    listPortfolio(req, res) {
        return this.stockService.getPortfolio(req.session.passport.user.email)
        .then((data) => {
            // console.log(data)
            res.json(data)
        })
        .catch((err) => res.status(500).json(500))
    }

    // get(req, res) {
    //     return this.stockService.listWatchlist(req.session.passport.user.email)
    //     .then((stocks) => {
    //         res.json(stocks)
    //     })
    //     .catch((err) => res.status(500).json(err));
    // };

    // add new portfolio
    addPortfolio(req, res) {
            return this.stockService.addPortfolio(req.session.passport.user.id, req.params.portfolio).then((data) => {
                res.redirect('back')
                .catch((err) => res.status(500).json(err));
        })
    }

    // delete portfolio
    delPortfolio(req, res) {
        return this.stockService.delPortfolio(req.session.passport.user.id, req.params.portfolio).then(() => {
            console.log('deleted ', portfolio, ' from portfolios')
            res.redirect('back')
        })
        .catch((err) => res.status(500).json(err))    
    }

    listPortfolioStocks(req, res) {
        return this.stockService.listPortfolioStocks(req.session.passport.user.id, req.params.portfolio).then((data) => {
            res.json(data)
        })
        .catch((err) => res.status(500).json(err))
    }

    getCurrentShares(req, res) {
        return this.stockService.getCurrentShares(req.params.portfolio, req.params.stock).then((data) => {
            res.json(data)
        })
        .catch((err) => res.status(500).json(err))
    }

    getAveragePrice(req, res) {
        return this.stockService.getAveragePrice(req.params.portfolio, req.params.stock).then((data) => {
            res.json(data)
        })
        .catch((err) => res.status(500).json(err))
    }




}

module.exports = StockRouter;

