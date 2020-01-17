const express = require('express');
const app = express();
const session = require('express-session');
const setupPassport = require('./initpassport');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const StockService = require('./Service/stockService');
const StockRouter = require('./Router/stockRouter');
const AuthRouter = require('./Router/authRouter')(express);
const ViewRouter = require('./Router/viewRouter')(express);
const https = require('https');
const fs = require('fs');
const knexConfig = require('./knexfile').development;
const knex = require('knex')(knexConfig);

const port = process.env.PORT || 3030;

const stockService = new StockService(knex);

app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static('public'));

// setup handlebars as engine
app.engine('handlebars', hbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// allows passport to initialize itself (app.use lines in passport.js)
setupPassport(app);

// using the routers
<<<<<<< HEAD
app.use('/stocks', (new StockRouter(stockService)).router());
=======
app.use('/dashboard', (new StockRouter(stockService)).router());
>>>>>>> b920f4fae219c2a9cdfc204cc8b453baf0ea0f4a
app.use('/', AuthRouter);
app.use('/', ViewRouter);

const options = {
    cert: fs.readFileSync('./localhost.crt'),
    key: fs.readFileSync('./localhost.key')
};

https.createServer(options, app).listen(port);
<<<<<<< HEAD
console.log('running at 3030')
=======
console.log('running at 3030')
>>>>>>> b920f4fae219c2a9cdfc204cc8b453baf0ea0f4a
