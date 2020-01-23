class StockService {
    constructor(knex) {
        this.knex = knex;
    }

    // list all stocks in the database
    listAllStocks () {
        return new Promise ((resolve, reject) => {
            let data = this.knex('stocks')
            .select('symbol');

            data.then((res) => {
                var stocks = []
                for (let stock of res) {
                    stocks.push(stock.symbol)
                }
                resolve(stocks)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

    // list the wachlisted stocks of the user
    listWatchlist (user) {
        return new Promise ((resolve, reject) => {
            let data = this.knex('userstocks')
            .join('users', 'userstocks.user_id', 'users.id')
            .join('stocks', 'userstocks.stocks_symbol', 'stocks.symbol')            
            .select('stocks.symbol')
            .where('users.email', user)
            .orderBy('userstocks.id');
    
            data.then((res) => {
                // console.log(res)
                resolve(res)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

    // list the portfolios under the user's name
    getPortfolio (user) {
        return new Promise ((resolve, reject) => {
            let data = this.knex('portfolios')
            .join('users', 'portfolios.user_id', 'users.id')
            .select('portfolios.name')
            .select('portfolios.id')
            .where('users.email', user)
            .orderBy('portfolios.id');

            data.then((res) => {
                // console.log(res)
                resolve(res)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

    // get the ID of the portfolio
    getPortfolioID (param) {
        return new Promise ((resolve, reject) => {
            let data = this.knex('portfolios').where({name:param})

            data.then((res) => {
                // console.log(res)
                resolve(res[0].id);
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

    // get the list of stocks under a portfolio
    getHoldings (user, portfolio) {
        return new Promise ((resolve, reject) => {
            let data = this.knex('portfoliostocks')
            .join('users', 'portfoliostocks.user_id', 'users.id')
            .join('stocks', 'portfoliostocks.stocks_symbol', 'stocks.symbol')
            .join('portfolios', 'portfoliostocks.portfolio_id', 'portfolios.id')
            .select('stocks.symbol')
            .select('portfolios.name')
            .where('users.email', user)
            .where('portfolios.name', portfolio)
            .groupBy('stocks.symbol', 'portfolios.name')
    
            data.then((res) => {
                // console.log(res)
                resolve(res);
            })
            .catch((err) => {
                console.error(err);
            })
        })
    }

    // add buy OR sell records of a stock
    addBuy (portfolioID, stock, userID, action, amount, price ) {
        return new Promise ((resolve, reject) => {
            let data = this.knex('portfoliostocks').insert({
                portfolio_id: portfolioID,
                stocks_symbol: stock,
                user_id: userID,
                action: `${action}`,
                amount: amount,
                price: price
            })
            
            data.then((res) => {
                // console.log(res)
                resolve('data added');
            })
        })
    }

    // add a stock into our database (mainly for checking purposes)
    addStock (param) {
        return new Promise (async (resolve, reject) => {
            let data = await this.knex('stocks').where({
                symbol: param
            })
            if (data.length === 0) {
                return this.knex('stocks').insert({
                    symbol: param
                })
                .then((res) => {
                    console.log('added', param)
                    resolve('YES')
                })
            }
            else {
                resolve('NO')
            }
        })
    }

    // add stock to watchlist
    addWatchlist (user, stock) {
        return new Promise (async (resolve, reject) => {
            let data = await this.knex('userstocks').where({
                user_id: user,
                stocks_symbol: stock
            })
            // if the stock hasn't been inserted, insert it to the watchlist
            if (data.length === 0) {
                return this.knex('userstocks').insert({
                    user_id: user,
                    stocks_symbol: stock
                })
                .then((res) => {
                    console.log('added', stock)
                    resolve('YES')
                })
            }
            // if the stock already exists in the watchlist, do nothing
            else {
                resolve('NO')
            }
        })
    }

    // delete stock from watchlist
    delWatchlist (user, stock) {
        return new Promise ((resolve, reject) => {
            let data = this.knex('userstocks').where({
                user_id: user,
                stocks_symbol: stock
            }).del()

            data.then((res) => {
                console.log('deleted ', stock, ' from watchlist')
                resolve('data added')
            })
        })
    }

    // add portfolio
    addPortfolio (user, portfolio) {
        return new Promise (async (resolve, reject) => {
            let data = await this.knex('portfolios').where({
                user_id: user,
                name: portfolio
            })
            // if the portfolio hasn't been created, create it
            if (data.length === 0) {
                return this.knex('portfolios').insert({
                    user_id: user,
                    name: portfolio
                })
                .then((res) => {
                    console.log('added ', portfolio, ' to portfolios')
                    resolve('YES')
                })
            }
            // if the portfolio already exists, do nothing
            else {
                resolve('NO')
            }
        })
    }

    // delete portfolio
    delPortfolio (user, portfolio) {
        return new Promise ((resolve, reject) => {
            let data = this.knex('portfolios')
            .join('portfoliostocks', 'portfolios.id', 'portfoliostocks.portfolio_id')
            .select('portfolios.id')
            .select('portfoliostocks.portfolio_id')
            .where('portfolios.name', portfolio)

            data.then((res) => {
                if (res.length === 0) {
                    return this.knex('portfolios').where({
                        user_id: user,
                        name: portfolio
                    }).del()
                }
                else {
                    let target = this.knex('portfoliostocks')
                    .join('portfolios', 'portfoliostocks.portfolio_id', 'portfolios.id')
                    .select('portfoliostocks.portfolio_id')
                    .where('portfolios.name', portfolio)
                    // .del()

                    target.then((res) => {
                        // console.log(res)
                        return this.knex('portfolios').where({
                            user_id: user,
                            name: portfolio
                        }).del()
                    })
                }
                resolve('data deleted')
            })
        })
    }

    // calculate the number of shares a user has on a stock and return the average price of each purchase
    getAveragePrice (portfolio, stock) {
        return new Promise ((resolve, reject) => {
            let data = this.knex('portfoliostocks')
            .join('portfolios', 'portfoliostocks.portfolio_id', 'portfolios.id')
            .select('stocks_symbol')
            .select('action')
            .select('amount')
            .select('price')
            .where('portfolios.name', portfolio)
            .where('portfoliostocks.action', 'buy')
            .where('portfoliostocks.stocks_symbol', stock)

            data.then((res) => {
                var totalBuy= 0;
                var totalShares = 0;
                for (let each of res) {
                    totalBuy += each.price*each.amount;
                    totalShares += each.amount;
                }
                var average = totalBuy/totalShares
                // console.log(average)
                resolve(average)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

    // list all stocks a user has 
    listPortfolioStocks (user, portfolio) {
        return new Promise ((resolve, reject) => {
            let data = this.knex('portfoliostocks')
            .join('portfolios', 'portfoliostocks.portfolio_id', 'portfolios.id')
            .select('stocks_symbol')
            .where('portfolios.name', portfolio)
            .where('portfoliostocks.user_id', user)
            .groupBy('portfoliostocks.stocks_symbol')

            data.then((res) => {
                var output = []
                for (let each of res) {
                    output.push(each.stocks_symbol)
                }
                // console.log(output)
                resolve(res)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

    // calcualte how many shares of a stock user currently has
    getCurrentShares (portfolio, stock) {
        return new Promise ((resolve, reject) => {
            let data = this.knex('portfoliostocks')
            .join('portfolios', 'portfoliostocks.portfolio_id', 'portfolios.id')
            .select('stocks_symbol')
            .select('action')
            .select('amount')
            .select('price')
            .where('portfolios.name', portfolio)
            .where('portfoliostocks.stocks_symbol', stock)

            // add all the transactions amounts together, because if the action was 'sold' a negative number will be added to the database
            data.then((res) => {
                var totalSales= []
                for (let each of res) {
                    totalSales.push(each.amount)
                }
                function add(accumulator, a) {
                    return accumulator + a;
                }
                var total = totalSales.reduce(add);
                // console.log(total)
                resolve(total)
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

    searchStock () {
        // search stocks by stock code etc, scan database for matches and return matches
    }

}

module.exports = StockService;

const knexConfig = {
    client: 'postgresql',
    connection: { database: 'stockbots', user: 'postgres', password: 'postgres' },
    pool: { min: 2, max: 10 },
    migrations: { tableName: 'knex_migrations' }
  }
// console.log(knexConfig)

const knex = require('knex')(knexConfig);

const test = new StockService(knex);

// test.listWatchlist('yickkiu.leung@gmail.com')
// test.getPortfolio('akira9408@hotmail.com')
// test.getHoldings('akira9408@hotmail.com', 'real estate hk')
// test.addBuy(1, 'ADVD', 1, 'buy', 100, 12)
// test.getPortfolioID('real estate hk')
// test.addStock('YUJDbbb')
// test.getAveragePrice('real estate hk', 'TSLA')
// test.addWatchlist(1, 'SPOT')
// test.delWatchlist(1, 'SPOT')
// test.addPortfolio(1, 'HAHAHHAA')
// test.delPortfolio(1, 'HAHAHHAA')
// test.listPortfolioStocks(1, 'real estate hk')
// test.getCurrentShares('real estate hk', 'TSLA')
// test.listAllStocks()




// selects everything

// let data = this.knex('userstocks')
// .join('users', 'userstocks.user_id', 'users.id')
// .join('stocks', 'userstocks.stocks_id', 'stocks.id')
// .select('*')
// // .select('userstocks.stocks_id', 'userstocks.user_id')
// // .select('userstocks.stocks_id', 'stocks.symbol')
// .where('users.email', user)
// .orderBy('userstocks.id');
