const router = require('express').Router()

router.get('/', (req, res) => {
  console.log(req.user)
  res.json({ success: true })
})

module.exports = router
