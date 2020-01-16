class StockService {
    constructor(knex) {
        this.knex = knex;
    }

    listWatchlist (user) {
        return new Promise ((resolve, reject) => {
            // return new Promise ((resolve, reject) => {
            let data = this.knex('userstocks')
            .join('users', 'userstocks.user_id', 'users.id')
            .join('stocks', 'userstocks.stocks_id', 'stocks.id')
            // .select('userstocks.stocks_id', 'userstocks.user_id')
            .select('stocks.symbol')
            .where('users.email', user)
            .orderBy('userstocks.id');
    
            data.then((res) => {
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

    getHoldings (user, portfolio) {
        return new Promise ((resolve, reject) => {
            // return new Promise ((resolve, reject) => {
            let data = this.knex('portfoliostocks')
            .join('users', 'portfoliostocks.user_id', 'users.id')
            .join('stocks', 'portfoliostocks.stocks_id', 'stocks.id')
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

    addBuy (portfolioID, stocksID, userID, action, amount, price ) {
        return new Promise ((resolve, reject) => {
            let data = this.knex('portfoliostocks').insert({
                portfolio_id: portfolioID,
                stocks_id: stocksID,
                user_id: userID,
                action: `${action}`,
                amount: amount,
                price: price
            })
            data.then((res) => {
                resolve('data added');
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
test.getHoldings('akira9408@hotmail.com', 'real estate hk')




// selects everything

// let data = this.knex('userstocks')
// .join('users', 'userstocks.user_id', 'users.id')
// .join('stocks', 'userstocks.stocks_id', 'stocks.id')
// .select('*')
// // .select('userstocks.stocks_id', 'userstocks.user_id')
// // .select('userstocks.stocks_id', 'stocks.symbol')
// .where('users.email', user)
// .orderBy('userstocks.id');
