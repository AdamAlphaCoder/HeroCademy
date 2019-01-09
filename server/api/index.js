const router = require('express').Router()

const auth = require('./auth')

// Import of middleware
const checkAuth = require('../middleware/checkAuth')

// TODO: Set up routes
router.use('/auth', auth)

module.exports = router
