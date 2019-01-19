const { Strategy: FacebookStrategy } = require('passport-facebook')
const { Strategy: LocalStrategy } = require('passport-local')

const User = require('./models/User')
const USER = require('./models/constants/USER')

// Declare Passport strategies
module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user._id)
  })

  passport.deserializeUser((_id, done) => {
    User.findById(_id)
      .select('name email image role')
      .then(user => {
        done(null, user)
      })
      .catch(err => {
        done(err, false)
      })
  })

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_clientID,
        clientSecret: process.env.FB_clientSecret,
        // FIXME: Change this to change depending if app is in production
        callbackURL: 'http://localhost:3000/api/auth/facebook/callback',
        profileFields: [
          'id',
          'displayName',
          'email',
          'name',
          'picture.type(large)'
        ]
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOneAndUpdate(
          { facebookId: profile.id },
          {
            $setOnInsert: profile.emails
              ? {
                  facebookId: profile.id,
                  name: profile.displayName,
                  email: profile.emails[0].value,
                  image: ((profile.photos || [])[0] || {}).value,
                  role: USER.types.STUDENT
                }
              : {
                  facebookId: profile.id,
                  name: profile.displayName,
                  image: ((profile.photos || [])[0] || {}).value,
                  role: USER.types.STUDENT
                }
          },
          { new: true, upsert: true }
        )
          .select('name email image password role')
          .then(user => done(null, user))
          .catch(err => done(err))
      }
    )
  )

  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email })
        .select('name email image password role')
        .exec((err, user) => {
          if (err) return done(err)
          if (!user) return done(null, false, { message: "User doesn't exist" })
          user.comparePassword(password, (err, isMatch) => {
            if (err) return done(err)
            if (!isMatch)
              return done(null, false, { message: 'Incorrect password' })
            done(null, user)
          })
        })
    })
  )
}
