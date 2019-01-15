const USER = require('../models/constants/USER')

module.exports = (req, res, next) => {
  const { role } = req.user

  role === USER.types.ADMIN || role === USER.types.LECTURER
    ? next()
    : res.status(403).json({
        success: false,
        message: 'You are not authorized to create a course'
      })
}
