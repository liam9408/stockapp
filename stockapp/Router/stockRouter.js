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
        // router.get('/', this.getWatch.bind(this)); <<<<<<<<<
        // router.post('/', this.post.bind(this));
        router.post('/transactions/:stock/:portfolio/:action/:amount/:price', this.post.bind(this));
        // router.put('/', this.post.bind(this));
        // router.delete('/', this.post.bind(this));
        return router
    }

    get(req, res) {
        console.log(req.session.passport.user.email, "<========wow")
        return this.stockService.listWatchlist(req.session.passport.user.email)
        .then((stocks) => {
            console.log(stocks)
            res.render(stocks)
        })
        .catch((err) => res.status(500).json(err));
    };

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

    getWatch() {}

}

module.exports = StockRouter;

