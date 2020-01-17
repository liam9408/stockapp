
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('userstocks').del()
    .then(function () {
      console.log('4')

      // Inserts seed entries
      return knex('userstocks').insert([
        {user_id: 1, stocks_id: 1},
        {user_id: 1, stocks_id: 2},
        {user_id: 1, stocks_id: 3},
        {user_id: 2, stocks_id: 1},
        {user_id: 2, stocks_id: 2},
        {user_id: 2, stocks_id: 3},
      ]);
    });
};
