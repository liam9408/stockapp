class StockService {
    constructor(knex) {
        this.knex = knex;
    }

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

    getPortfolio (user) {
        return new Promise ((resolve, reject) => {
            let data = this.knex('portfolios')
            .join('users', 'portfolios.user_id', 'users.id')
            .select('portfolios.name')
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

    addWatchlist (user, stock) {
        return new Promise (async (resolve, reject) => {
            let data = await this.knex('userstocks').where({
                user_id: user,
                stocks_symbol: stock
            })
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
            else {
                resolve('NO')
            }
        })
    }

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

    addPortfolio (user, portfolio) {
        return new Promise (async (resolve, reject) => {
            let data = await this.knex('portfolios').where({
                user_id: user,
                name: portfolio
            })
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
            else {
                resolve('NO')
            }
        })
    }

    // delPortfolio (user, portfolio) {
    //     return new Promise ((resolve, reject) => {
    //         let data = this.knex('portfolios').where({
    //             user_id: user,
    //             name: portfolio
    //         }).del()

    //         data.then((res) => {
    //             console.log('deleted ', portfolio, ' from portfolios')
    //             resolve('data deleted')
    //         })
    //     })
    // }

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
                        console.log(res)
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

    getAveragePrice (stock, user, portfolio) {
        return new Promise ((resolve, reject) => {
            let data = this.knex('portfoliostocks')
            .join('users', 'portfoliostocks.user_id', 'users.id')
            .join('stocks', 'portfoliostocks.stocks_symbol', 'stocks.symbol')
            .select('portfoliostocks.stocks_symbol')
            .select('portfoliostocks.amount')
            .select('portfoliostocks.price')
            .where('users.id', user)
            .where('stocks.symbol', stock)
            .where('portfoliostocks.portfolio_id', portfolio)

            data.then((res) => {
                var totalAmount = 0;
                var price = 0;
                for (let i of res) {
                    // console.log(res)
                    // console.log(i.price)
                    totalAmount += i.amount;
                    price += i.price;
                }
                var averagePrice = (price / res.length)
                // console.log(price, '<<<<< price!!!')
                // console.log(averagePrice, '<<<<< avgPrice!!')
                // console.log(totalAmount, '<<<<total amount')
                // console.log(res.length)
                // console.log(res[1].amount)
                resolve(averagePrice)
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
// test.getAveragePrice('ADVD', 1, 1)
// test.addWatchlist(1, 'SPOT')
// test.delWatchlist(1, 'SPOT')
// test.addPortfolio(1, 'HAHAHHAA')
// test.delPortfolio(1, 'HAHAHHAA')




// selects everything

// let data = this.knex('userstocks')
// .join('users', 'userstocks.user_id', 'users.id')
// .join('stocks', 'userstocks.stocks_id', 'stocks.id')
// .select('*')
// // .select('userstocks.stocks_id', 'userstocks.user_id')
// // .select('userstocks.stocks_id', 'stocks.symbol')
// .where('users.email', user)
// .orderBy('userstocks.id');
