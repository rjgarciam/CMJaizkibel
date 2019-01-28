var config     = require('./config');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var GClientID = process.env.GCLIENTID || config.googleAuth.clientID;
var GClientSecret = process.env.GCLIENTSECRET || config.googleAuth.clientSecret;
var GCallback = process.env.GCALLBACK || config.googleAuth.callbackURL;


// Use the GoogleStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Google
//   profile), and invoke a callback with a user object.
module.exports = function(passport){

	passport.use(new GoogleStrategy({
	    clientID: GClientID,
	    clientSecret: GClientSecret,
	    callbackURL: GCallback,
	    userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
	  },
	  function(accessToken, refreshToken, profile, done) {
	    return done(null, profile.emails[0].value);
	  }
	));

}
