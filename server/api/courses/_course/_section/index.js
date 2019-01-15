const router = require('express').Router({ mergeParams: true })

const asset = require('./_asset')

// Gets a single course section
router.get('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: `/courses/${req.params.course}/${req.params.section} GET`
    })
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    })
  }
})

// Creates a single course section
router.post('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: `/courses/${req.params.course}/${req.params.section} POST`
    })
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    })
  }
})

// Deletes a single course section
router.delete('/', (req, res) => {
  try {
    res.json({
      success: true,
      message: `/courses/${req.params.course}/${req.params.section} DELETE`
    })
  } catch (err) {
    res.json({
      success: false,
      message: err.message
    })
  }
})

router.use('/:asset', asset)

module.exports = router
