const router = require('express').Router()

const _id = require('./_id')

router.use('/:id', _id)

module.exports = router
