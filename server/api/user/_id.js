const router = require('express').Router({ mergeParams: true })

router.get('/', (req, res) => {
  res.json({
    success: true,
    id: req.params.id
  })
})

module.exports = router
