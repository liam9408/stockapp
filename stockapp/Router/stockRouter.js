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

    getWatch() {}

}

module.exports = StockRouter;

