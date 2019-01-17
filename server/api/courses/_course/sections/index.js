const router = require('express').Router({ mergeParams: true })

const Course = require('../../../../models/Course')
const CourseSection = require('../../../../models/CourseSection')

const _section = require('./_section')

// Lists all sections in course
router.get('/', async (req, res) => {
  try {
    const course = await Course.findOne({
      slug: req.params.course
    }).lean()

    if (!course) {
      return res.json({
        success: false,
        courseSections: []
      })
    }

    const courseSections = await CourseSection.find({
      course: course._id
    }).lean()

    return res.json({
      success: !!courseSections.length,
      courseSections
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

// Creates a single course section
router.post('/', async (req, res) => {
  try {
    // TODO: Use JOI to ensure all stuffs are filled before posting to MongoDb
    const { name } = req.body

    const course = await Course.findOne({
      slug: req.params.course
    }).lean()

    if (!course) {
      return res.json({
        success: false,
        courseSection: null
      })
    }

    const courseSection = new CourseSection({
      name,
      course: course._id
    })

    await courseSection.save()

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

router.use('/:section', _section)

module.exports = router
