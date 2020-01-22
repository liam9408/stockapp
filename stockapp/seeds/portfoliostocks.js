
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('stocks').del()
    .then(function () {
      console.log('2')

      // Inserts seed entries
      return knex('stocks').insert([
        {symbol: 'TSLA'},
        {symbol: 'AMZN'},
        {symbol: 'GOOG'},
        {symbol: 'SPOT'},
        {symbol: 'AAPL'},
        {symbol: 'MSFT'},
        {symbol: 'NFLX'}
      ]);
    });
};