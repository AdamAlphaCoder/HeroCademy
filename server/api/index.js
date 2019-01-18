const router = require('express').Router()

const auth = require('./auth')
const test = require('./test')
const courses = require('./courses')

// Import of middleware
const checkAuth = require('../middleware/checkAuth')

// TODO: Set up routes
router.use('/auth', auth)
router.use('/test', checkAuth, test)
router.use('/courses', checkAuth, courses)

module.exports = router
