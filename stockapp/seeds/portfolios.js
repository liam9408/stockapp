
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('portfolios').del()
    .then(function () {
      console.log('1')
      // Inserts seed entries
      return knex('portfolios').insert([
        {name: 'real estate hk', user_id: 1},
        {name: 'finance hk', user_id: 1},
        {name: 'US stocks', user_id: 2}
      ]);
    });
};

