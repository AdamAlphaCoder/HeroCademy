const router = require('express').Router({ mergeParams: true })

const _id = require('./_id')

const Course = require('../../../../models/Course')
const CourseReview = require('../../../../models/CourseReview')

// Gets all reviews for course
router.get('/', async (req, res) => {
  const perPage = 30
  try {
    const page = Number(req.query.page) || 0
    const course = await Course.findOne({
      slug: req.params.course
    }).lean()

    if (!course) {
      return res.json({
        success: false,
        courseReviews: []
      })
    }

    const count = await CourseReview.count({}).lean()
    let courseReviews = []

    if (count > page * perPage) {
      courseReviews = await CourseReview.find({
        course: course._id
      })
        .sort({ date: -1 })
        .skip(page * perPage)
        .limit(perPage)
        .lean()
    }

    res.json({
      success: !!courseReviews.length,
      courseReviews,
      count
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

// Creates review for course
router.post('/', async (req, res) => {
  try {
    // TODO: Check if user owns this course, and is not the owner
    const { rating, comment } = req.body
    const { _id: reviewer } = req.user

    const course = await Course.findOne({
      slug: req.params.course
    }).lean()

    if (!course) {
      return res.json({
        success: false,
        courseReview: null
      })
    }

    let courseReviewExists = await CourseReview.count({ reviewer })

    if (courseReviewExists) {
      return res.status(409).json({
        success: false,
        message: 'You already have a review for this course'
      })
    }

    const courseReview = new CourseReview({
      course: course._id,
      comment,
      rating,
      reviewer
    })

    await courseReview.save()

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

router.use('/:id', _id)

module.exports = router
