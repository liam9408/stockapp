
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('portfoliostocks').del()
    .then(function () {
      console.log('3')
      // Inserts seed entries
      return knex('portfoliostocks').insert([
        {portfolio_id: 1, stocks_symbol: 'AMZN', user_id: 1, action: 'buy', amount: 1000, price: 1880},
        {portfolio_id: 1, stocks_symbol: 'GOOG', user_id: 1, action: 'buy', amount: 980, price: 1455},
        {portfolio_id: 1, stocks_symbol: 'AMZN', user_id: 1, action: 'sell', amount: 200, price: 1886},
        {portfolio_id: 1, stocks_symbol: 'AMZN', user_id: 1, action: 'sell', amount: 340, price: 1920},
        {portfolio_id: 1, stocks_symbol: 'GOOG', user_id: 1, action: 'sell', amount: 600, price: 1464},
        {portfolio_id: 2, stocks_symbol: 'NFLX', user_id: 1, action: 'buy', amount: 5000, price: 360},
        {portfolio_id: 2, stocks_symbol: 'NFLX', user_id: 1, action: 'sell', amount: 4800, price: 320},
        {portfolio_id: 3, stocks_symbol: 'SPOT', user_id: 2, action: 'buy', amount: 600, price: 158.6}
      ]);
    });
};