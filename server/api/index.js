const router = require('express').Router()

const auth = require('./auth')
const test = require('./test')
const courses = require('./courses')
const me = require('./me')
const user = require('./user')

// Import of middleware
const checkAuth = require('../middleware/checkAuth')

// TODO: Set up routes
router.use('/auth', auth)
router.use('/test', checkAuth, test)
router.use('/courses', checkAuth, courses)
router.use('/me', checkAuth, me)
router.use('/user', checkAuth, user)

module.exports = router
