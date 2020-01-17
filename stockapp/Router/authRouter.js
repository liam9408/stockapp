const path = require('path');
//router.js
const passport = require('passport');


module.exports = (express) => {
    const router = express.Router();

    // // define middleware
    // function isLoggedIn(req, res, next) {
    //     // check if user is currently logged in
    //     if (req.isAuthenticated()) {
    //         return next();
    //     }
    //     // if not logged in, redirect to the landing page
    //     res.render('landing');
    // }
    
    // using our local login
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        failureRedirect: '/error'
    }));
    
    router.get('/error', (req, res) => {
        res.send('You are not logged in!');
    });
    
    // going to signup page
    router.get('/signup', (req, res) => {
        res.render('signup');
    });

    // using our local signup    
    router.post('/signup', passport.authenticate('local-signup', {
        failureRedirect: '/error'
    }), function(req, res) {
        res.render('dashboard');
    });

    // facebook auth
    router.get("/auth/facebook", passport.authenticate('facebook', {
        scope: ["email", "user_gender","user_link" ]
    }));

    router.get("/auth/facebook/callback", passport.authenticate('facebook', {
        failureRedirect: "/login",
        successRedirect: "/"
    }))

    // google auth
    router.get('/auth/google', passport.authenticate('google', { 
        scope: ['https://www.googleapis.com/auth/plus.login',
                'https://www.googleapis.com/auth/userinfo.email'] 
    }));

    router.get('/auth/google/callback', passport.authenticate('google', { 
        failureRedirect: "/login", 
        successRedirect: "/"
    }))

    return router;
};
