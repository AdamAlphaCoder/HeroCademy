const router = require('express').Router({ mergeParams: true })

const sections = require('./sections')
const reviews = require('./reviews')
const upload = require('../../../upload')

const checkLecturerStatus = require('../../../middleware/checkLecturerStatus')

const Course = require('../../../models/Course')
const CourseSection = require('../../../models/CourseSection')
const CourseSectionAsset = require('../../../models/CourseSectionAsset')

// Gets a single course
router.get('/', async (req, res) => {
  try {
    const course = await Course.findOne({
      slug: req.params.course
    })
      .populate('lecturer', 'role email name image')
      .lean()

    const courseSections = await CourseSection.find({
      course: course._id
    }).lean()

    const courseSectionAssets = await CourseSectionAsset.find({
      courseSection: { $in: courseSections.map(section => section._id) }
    })

    course.sections = courseSections
      .map(section => {
        section.assets = courseSectionAssets
          .filter(asset => String(asset.courseSection) === String(section._id))
          .sort((a, b) => a.position - b.position)

        return section
      })
      .sort((a, b) => a.position - b.position)

    res.json({
      success: !!course,
      course
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

// Updates a single course
router.patch(
  '/',
  checkLecturerStatus,
  upload.single('image'),
  async (req, res) => {
    // TODO: Check if user is the lecturer before proceeding
    try {
      const { body } = req
      const keys = ['description']

      const update = {}

      keys.forEach(key => {
        // eslint-disable-next-line
        if (body[key]) update[key] = body[key]
      })

      // If image is provided, the URL of the image will be updated as well
      if ((req.file || {}).location) update.image = req.file.location

      const course = await Course.findOneAndUpdate(
        {
          slug: req.params.course
        },
        update,
        { new: true }
      ).lean()

      res.json({
        success: !!course,
        course
      })
    } catch (err) {
      res.status(500).json({
        success: false,
        message: err.message
      })
    }
  }
)

router.delete('/', async (req, res) => {
  // TODO: Check if user is the lecturer before proceeding
  try {
    const course = await Course.findOneAndDelete({
      slug: req.params.course
    })

    res.json({
      success: !!course,
      course
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

router.use('/reviews', reviews)
router.use('/sections', sections)

module.exports = router
