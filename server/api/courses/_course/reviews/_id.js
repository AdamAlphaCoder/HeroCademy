const router = require('express').Router({ mergeParams: true })

const Course = require('../../../../models/Course')
const CourseReview = require('../../../../models/CourseReview')

// Gets a single course review
router.get('/', async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.course
    }).lean()

    if (!course) {
      return res.json({
        success: false,
        courseReview: null
      })
    }

    const courseReview = await CourseReview.findOne({
      _id: req.params.id,
      course: course._id
    }).lean()

    res.json({
      success: !!courseReview,
      courseReview
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

// Updates a single course review
router.patch('/', async (req, res) => {
  // TODO: Validate req body before continuing
  // TODO: Check if user is the reviewer for this review before allowing
  try {
    const course = await Course.findOne({
      _id: req.params.course
    }).lean()

    if (!course) {
      return res.json({
        success: false,
        courseReview: null
      })
    }

    const courseReview = await CourseReview.findOneAndUpdate(
      {
        _id: req.params.id,
        course: course._id
      },
      { new: true }
    )

    res.json({
      success: !!courseReview,
      courseReview
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

module.exports = router
