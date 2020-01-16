const passport = require('passport')

module.exports = (app)=>{
    app.use(passport.initialize());
    app.use(passport.session());

    // getting user data from knex database and storing it in a session
    passport.serializeUser((user,done)=>{
        done(null, user);
    });

    passport.deserializeUser((user,done)=>{
        done(null, user);
    });

    require('./Strategy/facebookStrategy')(passport);
    require('./Strategy/googleStrategy')(passport);
    require('./Strategy/passport')(passport);
}