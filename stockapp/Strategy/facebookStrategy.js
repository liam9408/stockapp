const FacebookStrategy = require('passport-facebook').Strategy;

require('dotenv').config();

const knex = require('knex')({
    client: 'postgresql',
    connection: {
        database: process.env.DB_NAME,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD
    }
});

module.exports = (passport) => {

    passport.use('facebook', new FacebookStrategy({
        clientID: process.env.AppID,
        clientSecret: process.env.AppSecret,
        callbackURL: `/auth/facebook/callback`,
        profileFields: ['id', 'email', 'name', 'gender', 'displayName', 'profileUrl']
    }, async (accessToken, refreshToken, profile, done) => {

        // console.log(profile);
        // checking our database to verify whether the user has previously created an account with us

        let userResult = await knex('users').where({ facebookID: profile.id });
        // if this is a new user, create a new user in our database
        if (userResult == 0) {
            let user = {
                name: profile.displayName,
                facebookID: profile.id,
                email: profile.emails[0].value,
                accessToken: accessToken
            }
            let query = await knex('users').insert(user).returning('id');
            user.id = query[0];
            done(null, user);
        } else {
            done(null, userResult[0])
        }
    }
    ));
  }