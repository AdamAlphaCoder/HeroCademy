const router = require('express').Router({ mergeParams: true })
const mongoose = require('mongoose')

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
    }).lean()

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

// Deletes a single course
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

// Updates course sections order
router.put('/updateSectionsOrder', async (req, res) => {
  try {
    const sections = req.body.sections

    if (!Array.isArray(sections)) {
      throw new Error('No array provided!')
    }

    sections.forEach(section => {
      if (!mongoose.Types.ObjectId.isValid(section)) {
        throw new Error('Invalid ID(s) provided!')
      }
    })

    const course = await Course.findOne({
      slug: req.params.course
    }).lean()

    if (!course) {
      return res.json({
        success: false
      })
    }

    await Promise.all(
      sections.map((section, index) =>
        CourseSection.update(
          // eslint-disable-next-line
          { _id: { $in: section }, course: course._id },
          { $set: { position: index } }
        )
      )
    )

    res.json({
      success: true
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

// Update course sections assets order
router.put('/updateAssetsOrder', async (req, res) => {
  try {
    // TODO: Later on, ensure that firstSection and secondSection are section objects?

    const firstSection = req.body.firstSection
    const secondSection = req.body.secondSection

    const course = await Course.findOne({
      slug: req.params.course
    }).lean()

    if (!course) {
      return res.json({
        success: false
      })
    }

    if (!firstSection) {
      return res.status(422).json({
        success: false,
        message: 'First Section not provided'
      })
    }

    await Promise.all(
      firstSection.assets.map((asset, index) =>
        CourseSectionAsset.update(
          // eslint-disable-next-line
          { _id: { $in: asset._id } },
          { $set: { position: index, courseSection: firstSection._id } }
        )
      )
    )

    // Check if there's duplicates assets with the same position
    const firstSectionLastAssetPosition =
      (await CourseSectionAsset.count({
        _id: firstSection._id
      }).lean()) - 1

    const firstSectionLastAssetExists = await CourseSectionAsset.count({
      position: firstSectionLastAssetPosition
    })

    if (firstSectionLastAssetExists === 0) {
      // There's two assets with position n - 1
      const firstSectionAffectedDocuments = await CourseSectionAsset.find({
        position: firstSectionLastAssetPosition - 1
      }).lean()

      await CourseSectionAsset.findByIdAndUpdate(
        firstSectionAffectedDocuments[1]._id,
        {
          position: firstSectionLastAssetPosition
        }
      )
    }

    if (secondSection) {
      // Only do this if second section is provided
      await Promise.all(
        secondSection.assets.map((asset, index) =>
          CourseSectionAsset.update(
            // eslint-disable-next-line
            { _id: { $in: asset._id } },
            { $set: { position: index, courseSection: secondSection._id } }
          )
        )
      )

      // REDUNDANT CODE, REFACTOR?

      // Check if there's duplicates assets with the same position
      const secondSectionLastAssetPosition =
        (await CourseSectionAsset.count({
          _id: secondSection._id
        }).lean()) - 1

      const secondSectionLastAssetExists = await CourseSectionAsset.count({
        position: secondSectionLastAssetPosition
      })

      if (secondSectionLastAssetExists === 0) {
        // There's two assets with position n - 1
        const secondSectionAffectedDocuments = await CourseSectionAsset.find({
          position: secondSectionLastAssetPosition - 1
        }).lean()

        await CourseSectionAsset.findByIdAndUpdate(
          secondSectionAffectedDocuments[1]._id,
          {
            position: secondSectionLastAssetPosition
          }
        )
      }
    }

    res.json({
      success: true
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
