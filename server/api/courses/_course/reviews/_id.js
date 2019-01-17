const router = require('express').Router({ mergeParams: true })

const Course = require('../../../../models/Course')
const CourseReview = require('../../../../models/CourseReview')

// Gets a single course review
router.get('/', async (req, res) => {
  try {
    const course = await Course.findOne({
      slug: req.params.course
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

// Deletes a single course review
router.delete('/', async (req, res) => {
  try {
    const course = await Course.findOne({
      slug: req.params.course
    }).lean()

    if (!course) {
      return res.json({
        success: false,
        courseReview: null
      })
    }

    const courseReview = await CourseReview.findOneAndDelete({
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
    const { body } = req
    const keys = ['rating', 'comment']

    const update = {}

    keys.forEach(key => {
      // eslint-disable-next-line
      if (body[key]) update[key] = body[key]
    })

    const course = await Course.findOne({
      slug: req.params.course
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
      update,
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
