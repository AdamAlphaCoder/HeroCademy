const router = require('express').Router({ mergeParams: true })

// Updates a single course review
router.patch('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: `/courses/${req.params.course}/reviews/${req.params.id} PATCH`
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    })
  }
})

module.exports = router
