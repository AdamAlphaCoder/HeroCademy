const router = require('express').Router({ mergeParams: true })

const _asset = require('./_asset')
const addAsset = require('./addAsset')

const Course = require('../../../../models/Course')
const CourseSection = require('../../../../models/CourseSection')

router.use('/addAsset', addAsset)

// Gets a single course section
router.get('/', async (req, res) => {
  try {
    const course = await Course.findOne({
      slug: req.params.course
    }).lean()

    if (!course) {
      return res.json({
        success: true,
        courseSection: null
      })
    }

    const courseSection = await CourseSection.findOne({
      slug: req.params.section,
      course: course._id
    }).lean()

    res.json({
      success: !!courseSection,
      courseSection
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

// Deletes a single course section
router.delete('/', async (req, res) => {
  try {
    const course = await Course.findOne({
      slug: req.params.course
    }).lean()

    if (!course) {
      return res.json({
        success: true,
        courseSection: null
      })
    }

    const courseSection = await CourseSection.findOneAndDelete({
      slug: req.params.section,
      course: course._id
    }).lean()

    res.json({
      success: !!courseSection,
      courseSection
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

router.use('/:asset', _asset)

module.exports = router
