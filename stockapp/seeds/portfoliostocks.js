
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('stocks').del()
    .then(function () {
      console.log('2')

      // Inserts seed entries
      return knex('stocks').insert([
        {symbol: 'ADVD'},
        {symbol: 'QWER'},
        {symbol: 'JKLO'},
        {symbol: 'YUER'},
        {symbol: 'VBDE'}
      ]);
    });
};
