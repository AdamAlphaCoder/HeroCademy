const router = require('express').Router()
const passport = require('passport')

const User = require('../../models/User')

router.post('/login', (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.json({ success: false, message: err.message })

    // Hides user password salt
    if (user) user.password = undefined

    res.status(user ? 200 : 401).json({
      success: !!user,
      user: user ? user : undefined,
      message: info ? info.message : undefined
    })
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

router.get(
  '/facebook',
  passport.authenticate('facebook', {
    authType: 'rerequest',
    scope: ['email']
  })
)

router.get('/facebook/callback', (req, res) => {
  passport.authenticate('facebook', (err, user, info) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message })
    }

    res.status(user ? 200 : 401).json({
      success: !!user,
      user: user ? user : undefined,
      message: info ? info.message : undefined
    })
  })(req, res)
})

module.exports = router
