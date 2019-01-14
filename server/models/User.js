const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userRoles = ['student', 'lecturer', 'admin']

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  facebookId: {
    type: String,
    unique: true,
    sparse: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: false
  },
  photo: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: userRoles,
    default: userRoles[0]
  }
})

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next()
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err)
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err)
      this.password = hash
      next()
    })
  })
})

UserSchema.methods.comparePassword = function(candidatePassword, next) {
  // Handle when user has no password saved (when using other auth methods)
  if (!this.password) return next(null, false)

  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return next(err)
    next(null, isMatch)
  })
}

module.exports = mongoose.model('User', UserSchema)
