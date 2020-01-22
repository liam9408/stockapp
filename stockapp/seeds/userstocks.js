
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('userstocks').del()
    .then(function () {
      console.log('4')

      // Inserts seed entries
      return knex('userstocks').insert([
        {user_id: 1, stocks_symbol: 'AMZN'},
        {user_id: 1, stocks_symbol: 'GOOG'},
        {user_id: 1, stocks_symbol: 'NFLX'},
        {user_id: 2, stocks_symbol: 'AAPL'},
        {user_id: 2, stocks_symbol: 'MSFT'},
        {user_id: 2, stocks_symbol: 'SPOT'},
      ]);
    });
};