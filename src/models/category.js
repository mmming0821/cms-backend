const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
  tag: String,
  create_time: Date,
  article_total: {
    type: Number,
    default: 0
  }
})

module.exports = mongoose.model('Category', categorySchema)
