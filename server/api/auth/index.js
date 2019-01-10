const router = require('express').Router()

const facebook = require('./facebook')
const login = require('./login')
const logout = require('./logout')
const register = require('./register')

const User = require('../../models/User')

router.patch('/', (req, res) => {
  if (!req.user || !req.user.id) return res.sendStatus(401)
  User.findById(req.user.id, (err, user) => {
    if (err) return res.sendStatus(404)
    user.comparePassword(req.body.currentPassword, (err, isMatch) => {
      if (err || !isMatch) return res.sendStatus(400)
      user.password = req.body.newPassword
      user.save(err => res.sendStatus(err ? 500 : 200))
    })
  })
})

router.use('/login', login)
router.use('/logout', logout)
router.use('/register', register)
router.use('/facebook', facebook)

module.exports = router
