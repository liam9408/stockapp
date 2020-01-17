const path = require('path');
const $ = require('jquery');
const knexConfig = require('../knexfile').development;
const knex = require('knex')(knexConfig);
const StockService = require('../Service/stockService');
const stockService = new StockService(knex);

module.exports = (express) => {
    const router = express.Router();

    // define middleware
    function isLoggedIn(req, res, next) {
        // check if user is currently logged in
        if (req.isAuthenticated()) {
            return next();
        }
        // if not logged in, redirect to the landing page
        res.render('landing');
    }
    
    // whenever we try to access this route, it checks if the user is logged in or not
    router.get('/',  isLoggedIn, (req, res) => {
        stockService.listWatchlist(req.session.passport.user.email).then((data) => {
            // console.log(data)
            res.render('dashboard', {
                user: req.session.passport.user.name, 
                data: data
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send(err)
        });
    });

<<<<<<< HEAD
    // list user's portfolios
    router.get('/portfolio',  isLoggedIn, (req, res) => {
        stockService.getPortfolio(req.session.passport.user.email).then((data) => {

            // var holdings = {
            //     key: []
            // };

            // var holdings = {}
            // var holdings = [] 

            // for (let i of data) {
                // console.log(i.name)
                // await stockService.getHoldings(req.session.passport.user.email, i.name).then((stocks) => {
                    // console.log(stocks[0].name)

                    // var porfName = stocks[0].name

                    // var sym = stocks.length
                    // console.log(sym)
                    // console.log(porfName)

                    // function addArray (obj) {
                    //     holdings[porfName].push(obj)
                    // }

                    // holdings[porfName] = [stocks[0].symbol, stocks[1].symbol]

                    // object
                    // var key;
                    // console.log(stocks, '<<<<<<<< stocks')
                    // holdings[key] = stocks;
                    // return holdings

                    // array
                    // console.log(stocks, '<<<<<<<< stocks')
                    // holdings.push(stocks);
            //     })
            // }
    
            // console.log(porfNames, '<<<<<<<< porfNAMESSSS')
            // console.log(holdings, '<<<<<<<< holding')
                res.render('portfolios', {
                    user: req.session.passport.user.name, 
                    portfolio: data
=======
    router.get('/portfolio',  isLoggedIn, (req, res) => {
        // stockService.getPortfolio(req.session.passport.user.email)
        // stockService.getHoldings(req.session.passport.user.email, promise1)

        stockService.getPortfolio(req.session.passport.user.email).then(async (data) => {
            var holdings = {
                key: []
            };
            var porfNames = new Set();
             console.log('data:',data)
            for (let i of data) {
                // console.log(i.name)
                await stockService.getHoldings(req.session.passport.user.email, i.name).then((stocks) => {
                    console.log(stocks)
                    function addArray (obj) {
                         holdings['key'].push(obj)
                         porfNames.add(obj.name)
                    }
                    stocks.map(addArray)
                    // console.log(stocks[0], '<<<<<<<< stocks')
                    // console.log(data.length)
                    // console.log(holdings['key'],'is this shit empty')
                    // var porf = {stocks}
                    // holdings[key] = stocks;
                    // holdings['key'].push(stocks);
                    //return holdings
                    // console.log(holdings[key], '<<<<<<<<<<<<<<<<<holdings key')
                })
            }
    
            console.log(holdings, '<<<<<<<< holding')
                res.render('portfolios', {
                    user: req.session.passport.user.name, 
                    holdings: holdings
>>>>>>> b920f4fae219c2a9cdfc204cc8b453baf0ea0f4a
                })
        })
        
        // .then(stockService.getHoldings(req.session.passport.user.email, portfolios)).then((holdings) => {
        //     console.log('this is holdings -------')
        //     console.log(holdings)
        //     res.render('portfolios', {
        //         user: req.session.passport.user.name, 
        //         data: holdings
        //     })
        // })

        .catch((err) => {
            console.log(err)
            res.status(500).send(err)
        });
<<<<<<< HEAD
    });

    // get a list of user's holdings in the portfolio
    router.get('/holdings/:portfolio',  isLoggedIn, (req, res) => {
        stockService.getHoldings(req.session.passport.user.email, req.params.portfolio ).then((data) => {
            res.render('holdings', {
                user: req.session.passport.user.name, 
                portfolio: req.params.portfolio,
                holdings: data
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send(err)
        });
    });

    // direct user to transactions page
    router.get('/transactions',  isLoggedIn, (req, res) => {
        stockService.getPortfolio(req.session.passport.user.email).then((data) => {
            res.render('transactions', {
                data: data
            })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).send(err)
        });
    });
    let counter  = 0
    router.get('/:stock/:id/:portfolio', isLoggedIn, (req, res) => {
        stockService.getPortfolioID(req.params.portfolio).then((data) => {
            var porfId = data
            counter++
            console.log("router: I'm called "+ counter +" times")
            console.log(data, '<<<<< data from view')
            
            // finally adding the transaction into our database
            return stockService.getAveragePrice(req.params.stock, req.params.id, porfId)
            .then((data) => {
                console.log(data, '<<<<<< data')
                res.render('test', {data: data})
            })
            .catch((err) => res.status(500).json(err));
        })
    })

    
    return router;
};
=======
        // var promise1 = stockService.getPortfolio(req.session.passport.user.email);
        // var promise2 = stockService.getHoldings(req.session.passport.user.email);
    
        // Promise.all([promise1, promise2]).then((data) => {
        // // $.when(stockService.getPortfolio(req.session.passport.user.email), stockService.getHoldings(req.session.passport.user.email)).then((portfolio, holdings) => {
        //     res.render('portfolios', {
        //         user: req.session.passport.user.name, 
        //         data:data
        //         // portfolio: data[0],
        //         // holdings: data[1]
        //     })
        // })
        // .catch((err) => {
        //     console.log(err)
        //     res.status(500).send(err)
        // });
    });

    return router;
};
>>>>>>> b920f4fae219c2a9cdfc204cc8b453baf0ea0f4a
