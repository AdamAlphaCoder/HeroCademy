const router = require('express').Router({ mergeParams: true })
const mongoose = require('mongoose')

const assets = require('./assets')

const Course = require('../../../../../models/Course')
const CourseSection = require('../../../../../models/CourseSection')

// Gets a single course section
router.get('/', async (req, res) => {
  try {
    const course = await Course.findOne({
      slug: req.params.course
    }).lean()

    if (!course) {
      return res.json({
        success: false,
        courseSection: null
      })
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.section)) {
      return res.json({
        success: false,
        courseSection: null
      })
    }

    const courseSection = await CourseSection.findOne({
      _id: req.params.section,
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
        success: false,
        courseSection: null
      })
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.section)) {
      return res.json({
        success: false,
        courseSection: null
      })
    }

    // TODO: Update the positions of all the other sections
    // Updating of sections should be ACID

    const courseSection = await CourseSection.findOneAndDelete({
      _id: req.params.section,
      course: course._id
    }).lean()

    if (courseSection) {
      const allSections = await CourseSection.find({})
        .sort({ position: 1 })
        .lean()

      await Promise.all(
        allSections.map((section, index) =>
          CourseSection.update(
            { _id: section._id },
            { $set: { position: index } }
          )
        )
      )
    }

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

// Updates a single course section
router.patch('/', async (req, res) => {
  try {
    const { body } = req
    // TODO: Update keys inside here
    const keys = ['name']

    const update = {}

    keys.forEach(key => {
      if (body[key]) update[key] = body[key]
    })

    const course = await Course.findOne({
      slug: req.params.course
    }).lean()

    if (!course) {
      return res.json({
        success: false,
        courseSection: null
      })
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.section)) {
      return res.json({
        success: false,
        courseSection: null
      })
    }

    const courseSection = await CourseSection.findOneAndUpdate(
      {
        _id: req.params.section,
        course: course._id
      },
      update,
      { new: true }
    ).lean()

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

router.use('/assets', assets)

module.exports = router
