const router = require('express').Router({ mergeParams: true })

const Course = require('../../../models/Course')
const CourseSection = require('../../../models/CourseSection')

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
      success: true,
      courseSection
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

module.exports = router
