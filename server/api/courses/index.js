const router = require('express').Router()

const course = require('./_course')

// List all courses
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: '/courses GET'
    })
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    })
  }
})

// Create new course
router.post('/', (req, res) => {
  // CAN ONLY BE DONE BY LECTURER
  try {
    res.json({
      success: true,
      message: '/courses POST'
    })
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    })
  }
})

router.use('/:course', course)

module.exports = router
