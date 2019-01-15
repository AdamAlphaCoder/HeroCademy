const router = require('express').Router({ mergeParams: true })

const _section = require('./_section')
const addSection = require('./addSection')
const reviews = require('./reviews')

const Course = require('../../../models/Course')

router.use('/:section', _section)
router.use('/addSection', addSection)
router.use('/reviews', reviews)

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
router.patch('/', async (req, res) => {
  try {
    const { body } = req
    const keys = ['description', 'image']

    const update = {}

    keys.forEach(key => {
      // eslint-disable-next-line
      if (body[key]) update[key] = body[key]
    })

    const course = await Course.findOneAndUpdate(
      {
        slug: req.params.course
      },
      update,
      { new: true }
    ).lean()

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

router.delete('/', async (req, res) => {
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

module.exports = router
