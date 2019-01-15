const router = require('express').Router({ mergeParams: true })

const section = require('./_section')
const review = require('./review')

// Gets a single course
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: `/courses/${req.params.course} GET`
    })
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    })
  }
})

// Updates a single course
router.patch('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: `/courses/${req.params.course} PATCH`
    })
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    })
  }
})

router.use('/:section', section)
router.use('/review', review)

module.exports = router
