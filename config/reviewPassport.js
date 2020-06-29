const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const Review = mongoose.model('Review')
const keys = require("../config/keys");


const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

//Export as this:
module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_paylodad, done) => {
      Review.findById(jwt_paylodad.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
