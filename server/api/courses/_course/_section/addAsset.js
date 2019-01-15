const router = require('express').Router({ mergeParams: true })

const Course = require('../../../../models/Course')
const CourseSection = require('../../../../models/CourseSection')
const CourseSectionAsset = require('../../../../models/CourseSectionAsset')

// Creates a single course section asset
router.post('/', async (req, res) => {
  try {
    // TODO: Use JOI to ensure all stuffs are filled before posting to MongoDb

    // TODO: Ensure that "type" is a valid type
    const { name, description, file, type } = req.body

    const course = await Course.findOne({
      slug: req.params.course
    }).lean()

    if (!course) {
      return res.json({
        success: false,
        courseSectionAsset: null
      })
    }

    const courseSection = await CourseSection.findOne({
      course: course._id
    }).lean()

    if (!courseSection) {
      return res.json({
        success: false,
        courseSectionAsset: null
      })
    }

    const courseSectionAsset = new CourseSectionAsset({
      name,
      description,
      file,
      type,
      courseSection: courseSection._id
    })

    await courseSectionAsset.save()

    res.json({
      success: true,
      courseSectionAsset
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

module.exports = router
