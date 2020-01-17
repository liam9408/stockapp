const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

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
    passport.use('google', new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `/auth/google/callback`,
        returnURL: '/auth/google/return',
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log(accessToken)
        // console.log(profile);
        // console.log(profile.emails[0].value)
        // checking our database to verify whether the user has previosuly created an account with us
        let userResult = await knex('users').where({ googleID: profile.id });
        // if this is a new user, create a new user in our database
        if (userResult == 0) {
            let user = {
                name: profile.displayName,
                googleID: profile.id,
                email: profile.emails[0].value,
                googleAccessToken: accessToken
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
