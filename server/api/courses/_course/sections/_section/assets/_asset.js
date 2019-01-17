const router = require('express').Router({ mergeParams: true })

const Course = require('../../../../../../models/Course')
const CourseSection = require('../../../../../../models/CourseSection')
const CourseSectionAsset = require('../../../../../../models/CourseSectionAsset')

// Gets a single course section asset
router.get('/', async (req, res) => {
  try {
    const course = await Course.findOne({
      slug: req.params.course
    }).lean()

    if (!course) {
      return res.json({
        success: false,
        courseSectionAssets: null
      })
    }

    const courseSection = await CourseSection.findOne({
      slug: req.params.section,
      course: course._id
    }).lean()

    if (!courseSection) {
      return res.json({
        success: false,
        courseSectionAssets: null
      })
    }

    const courseSectionAssets = await CourseSectionAsset.find({
      courseSection: courseSection._id
    }).lean()

    res.json({
      success: !!courseSectionAssets.length,
      courseSectionAssets
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

// Deletes a single course section asset
router.delete('/', async (req, res) => {
  try {
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
      slug: req.params.section,
      course: course._id
    }).lean()

    if (!courseSection) {
      return res.json({
        success: false,
        courseSectionAsset: null
      })
    }

    const courseSectionAsset = await CourseSectionAsset.findOneAndDelete({
      courseSection: courseSection._id
    }).lean()

    res.json({
      success: !!courseSectionAsset,
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
