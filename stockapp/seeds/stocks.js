
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('portfoliostocks').del()
    .then(function () {
      console.log('3')
      // Inserts seed entries
      return knex('portfoliostocks').insert([
        {portfolio_id: 1, stocks_symbol: 'ADVD', user_id: 1, action: 'buy', amount: 1000, price: 12.5},
        {portfolio_id: 1, stocks_symbol: 'QWER', user_id: 1, action: 'buy', amount: 980, price: 45},
        {portfolio_id: 1, stocks_symbol: 'QWER', user_id: 1, action: 'sell', amount: 200, price: 49},
        {portfolio_id: 1, stocks_symbol: 'ADVD', user_id: 1, action: 'sell', amount: 340, price: 11},
        {portfolio_id: 1, stocks_symbol: 'ADVD', user_id: 1, action: 'sell', amount: 600, price: 14},
        {portfolio_id: 2, stocks_symbol: 'JKLO', user_id: 1, action: 'buy', amount: 5000, price: 25.3},
        {portfolio_id: 2, stocks_symbol: 'JKLO', user_id: 1, action: 'sell', amount: 200, price: 26},
        {portfolio_id: 3, stocks_symbol: 'JKLO', user_id: 2, action: 'buy', amount: 600, price: 28.6}
      ]);
    });
};

