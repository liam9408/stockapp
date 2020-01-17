
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
      table.increments('id').unique().primary();
      table.string('name').unique();
      table.string('email').unique();
      table.string('password');
      table.string('facebookID').unique();
      table.string('accessToken').unique();
      table.string('googleID').unique();
      table.string('googleAccessToken').unique();
      table.timestamps(false, true);
  })
    
    .createTable('portfolios', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.integer('user_id').references('id').inTable('users');
      table.timestamps(false, true) // timestamps column
  })

    .createTable('stocks', (table) => {
      table.string('symbol').unique().primary();
      table.timestamps(false, true) // timestamps column
  })

    .createTable('portfoliostocks', (table) => {
      table.increments('id').primary();
      table.integer('portfolio_id').references('id').inTable('portfolios')
      table.string('stocks_symbol').references('symbol').inTable('stocks')
      table.integer('user_id').references('id').inTable('users');
      table.string('action')
      table.integer('amount')
      table.float('price')
      table.timestamps(false, true) // timestamps column
  })

    .createTable('userstocks', (table) => {
      table.increments('id').primary();
      table.integer('user_id').references('id').inTable('users');
      table.string('stocks_symbol').references('symbol').inTable('stocks');
      table.timestamps(false, true) // timestamps column
  })

  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users').dropTable('portfolios').dropTable('stocks').dropTable('portfoliostocks').dropTable('userstocks');
  };
  