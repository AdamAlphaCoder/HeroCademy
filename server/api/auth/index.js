const router = require('express').Router()
const passport = require('passport')

const facebook = require('./facebook')

const User = require('../../models/User')

router.post('/login', (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return res.status(400).json({ success: false, message: err.message })

    if (user) {
      req.logIn(user, e => {
        if (e)
          return res.status(400).json({ success: false, message: e.message })

        // Hides user password salt
        user.password = undefined

        res.status(200).json({
          success: true,
          user
        })
      })
    } else {
      res.status(401).json({
        success: false,
        message: info ? info.message : undefined
      })
    }
  })(req, res)
})

router.post('/register', (req, res) => {
  const { email, password, name } = req.body
  if (!email || !password || !name) {
    return res.status(400).json({
      success: false,
      message: 'Email, password and name are required'
    })
  }

  const user = new User({ email, password, name })
  user.save(err => {
    if (err) {
      return res.status(409).json({ success: false, message: err.message })
    }

    req.logIn(user, err => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message })
      }
      user.password = undefined
      res.json({
        success: true,
        user
      })
    })
  })
})

router.post('/logout', (req, res) => {
  req.logout()
  res.json({ success: true })
})

router.use('/facebook', facebook)

module.exports = router
