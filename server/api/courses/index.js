const router = require('express').Router()

const _course = require('./_course')
const checkLecturerStatus = require('../../middleware/checkLecturerStatus')

const Course = require('../../models/Course')

// List all courses
router.get('/', async (req, res) => {
  const perPage = 30

  try {
    const page = Number(req.query.page) || 0
    const count = await Course.count({}).lean()

    let courses = []

    if (count > page * perPage) {
      courses = await Course.find({})
        .sort({ date: -1 })
        .skip(page * perPage)
        .limit(perPage)
        .lean()
    }

    res.json({
      success: true,
      courses
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

// Create new course
router.post('/', checkLecturerStatus, async (req, res) => {
  try {
    // TODO: Use JOI to ensure all stuffs are filled before posting to MongoDb
    const { name, description, image } = req.body
    const { _id: lecturer } = req.user

    const course = new Course({
      name,
      description,
      image,
      lecturer
    })

    await course.save()

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

router.use('/:course', _course)

module.exports = router
