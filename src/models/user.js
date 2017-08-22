const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: String,
  nickname: String,
  password: String,
  avatar: String,
  create_time: Date,
  isAdmin: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('User', userSchema)
