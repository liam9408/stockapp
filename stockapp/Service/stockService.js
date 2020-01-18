class StockService {
    constructor(knex) {
        this.knex = knex;
        this.counter = 0
    }

    listWatchlist (user) {
        return new Promise ((resolve, reject) => {
            // return new Promise ((resolve, reject) => {
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
            console.log(param)
            let data = this.knex('portfolios').where({name:param})
            data.then((res) => {
                console.log(res, 'resssss')
                console.log(res[0], '<<<<<< res!!!!')
                this.counter++;
                console.log("service: I'm called "+this.counter +" times")
                resolve(res[0].id);
            })
            .catch((err) => {
                console.error(err)
            })
        })
    }

    getHoldings (user, portfolio) {
        return new Promise ((resolve, reject) => {
            // return new Promise ((resolve, reject) => {
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
        return new Promise ((resolve, reject) => {
            let data = this.knex('userstocks').insert({
                user_id: user,
                stocks_symbol: stock
            })
            data.then((res) => {
                resolve('data added')
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

// // const knexConfig = require('../knexfile.js').development;

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




// selects everything

// let data = this.knex('userstocks')
// .join('users', 'userstocks.user_id', 'users.id')
// .join('stocks', 'userstocks.stocks_id', 'stocks.id')
// .select('*')
// // .select('userstocks.stocks_id', 'userstocks.user_id')
// // .select('userstocks.stocks_id', 'stocks.symbol')
// .where('users.email', user)
// .orderBy('userstocks.id');
