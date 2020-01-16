




// var numStocks = 100;
// var stocks = [];
// var alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
// for (i=0; i<=10; i++) {
//   var stock = new Object();
//   stock.name = alphabet[Math.floor((Math.random()*26))] + alphabet[Math.floor((Math.random()*26))]+ alphabet[Math.floor((Math.random()*26))] +alphabet[Math.floor((Math.random()*26))];
//   stock.value = [Math.round(Math.random()*100000)/100];
//   stock.change = [(Math.random()*0.2)-0.1];
//   if(stock.change[0] >= 0) {
//     $('table tbody').append('<tr class="stock increase"><td class="name">'+stock.name+'</td><td class="value">'+stock.value+'</td><td class="change">'+(stock.change[0]*stock.value).toFixed(2)+'</td><td class="percentage">'+(stock.change[0]*100).toFixed(2)+'%</td></tr>');
//   } else {
//     $('table tbody').append('<tr class="stock decrease"><td class="name">'+stock.name+'</td><td class="value">'+stock.value+'</td><td class="change">'+(stock.change[0]*stock.value).toFixed(2)+'</td><td class="percentage">'+(stock.change[0]*100).toFixed(2)+'%</td></tr>');
//   }
//   stocks.push(stock);
// }
// console.log(stocks[50].name);


// get stock name from database
// ajax to get current price
// calculate price change
// calculate percentage




















// const knexConfig = require('./knexfile').development;
// const knex = require('knex')(knexConfig);


//   // let data =  knex.select('*').from('users').where('email', 'yickkiu.leung@gmail.com'); 

//   let data = knex('userstocks')
//   .join('users', 'userstocks.user_id', 'users.id')
//   .join('stocks', 'userstocks.stocks_id', 'stocks.id')
//   .select('userstocks.stocks_id', 'userstocks.user_id')
//   .select('userstocks.stocks_id', 'stocks.symbol')
//   .where('users.email', user)
//   .orderBy('userstocks.id');

//   return data.then((rows)=>{
//     console.log(rows)
//   })

//   async function getUser() {
//   let data = await knex.select('*').from('users').where('email', 'yickkiu.leung@gmail.com'); 
//   console.log(data)
// }

// getUser()
