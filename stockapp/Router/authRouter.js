const path = require('path');
//router.js
const passport = require('passport');


module.exports = (express) => {
    const router = express.Router();

    // define middleware
    function isLoggedIn(req, res, next) {
        // check if user is currently logged in
        if (req.isAuthenticated()) {
            return next();
        }
        // if not logged in, redirect to the landing page
        res.render('login');
    }

    router.get('/', isLoggedIn, (req, res) => {
        res.render('dashboard')
    })

    router.get('/login', isLoggedIn, (req, res) => {
        res.render('dashboard')
    })

    // using our local login
    router.post('/login', passport.authenticate('local-login', {
        successRedirect: '/dashboard',
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
        successRedirect: '/dashboard',
        failureRedirect: '/error'
    }));
    // , function(req, res) {
    //     res.successRedirect('/dashboard');
    // });

    // facebook auth
    router.get("/auth/facebook", passport.authenticate('facebook', {
        scope: ["email", "user_gender","user_link" ]
    }));

    router.get("/auth/facebook/callback", passport.authenticate('facebook', {
        failureRedirect: "/login",
        successRedirect: "/dashboard"
    }))

    // google auth
    router.get('/auth/google', passport.authenticate('google', { 
        scope: ['https://www.googleapis.com/auth/plus.login',
                'https://www.googleapis.com/auth/userinfo.email'] 
    }));

    router.get('/auth/google/callback', passport.authenticate('google', { 
        failureRedirect: "/login", 
        successRedirect: "/dashboard"
    }))

    return router;
};
