const router = require('express').Router()

const auth = require('./auth')
const test = require('./test')

// Import of middleware
const checkAuth = require('../middleware/checkAuth')

// TODO: Set up routes
router.use('/auth', auth)
router.use('/test', checkAuth, test)

module.exports = router
