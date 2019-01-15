const router = require('express').Router({ mergeParams: true })

const id = require('./_id')

// Creates review for course
router.post('/', (req, res) => {
  try {
    // TODO: Check if user owns this course, and is not the owner
    res.json({
      success: true,
      message: `/courses/${req.params.course}/review POST`
    })
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    })
  }
})

router.use('/:id', id)

module.exports = router
