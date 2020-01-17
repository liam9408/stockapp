
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('userstocks').del()
    .then(function () {
      console.log('4')

      // Inserts seed entries
      return knex('userstocks').insert([
        {user_id: 1, stocks_symbol: 'ADVD'},
        {user_id: 1, stocks_symbol: 'QWER'},
        {user_id: 1, stocks_symbol: 'JKLO'},
        {user_id: 2, stocks_symbol: 'ADVD'},
        {user_id: 2, stocks_symbol: 'QWER'},
        {user_id: 2, stocks_symbol: 'JKLO'},
      ]);
    });
};
