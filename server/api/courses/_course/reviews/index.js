const router = require('express').Router({ mergeParams: true })

const _id = require('./_id')

const Course = require('../../../../models/Course')
const CourseReview = require('../../../../models/CourseReview')

// Gets all reviews for course
router.get('/', (req, res) => {
  try {
    // TODO: Check if user owns this course, and is not the owner
    res.json({
      success: true,
      message: `/courses/${req.params.course}/reviews GET`
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

// Creates review for course
router.post('/', (req, res) => {
  try {
    // TODO: Check if user owns this course, and is not the owner
    res.json({
      success: true,
      message: `/courses/${req.params.course}/reviews POST`
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

router.use('/:id', _id)

module.exports = router
