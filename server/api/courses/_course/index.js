const router = require('express').Router({ mergeParams: true })

const sections = require('./sections')
const reviews = require('./reviews')
const upload = require('../../../upload')

const checkLecturerStatus = require('../../../middleware/checkLecturerStatus')

const Course = require('../../../models/Course')

// Gets a single course
router.get('/', async (req, res) => {
  try {
    const course = await Course.findOne({
      slug: req.params.course
    })
      .populate('lecturer', 'role email name image')
      .lean()

    res.json({
      success: true,
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
