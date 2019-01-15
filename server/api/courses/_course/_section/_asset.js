const router = require('express').Router({ mergeParams: true })

// Gets a single course section asset
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: `/courses/${req.params.course}/${req.params.section}/${
        req.params.asset
      } GET`
    })
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    })
  }
})

// Creates a single course section asset
router.post('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: `/courses/${req.params.course}/${req.params.section}/${
        req.params.asset
      } POST`
    })
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    })
  }
})

// Deletes a single course section asset
router.delete('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: `/courses/${req.params.course}/${req.params.section}/${
        req.params.asset
      } DELETE`
    })
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    })
  }
})

module.exports = router
