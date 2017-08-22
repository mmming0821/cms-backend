const mongoose = require('mongoose')
const Schema = mongoose.Schema

const articleSchema = mongoose.Schema({
  title: String,
  tags: [{type: Schema.Types.ObjectId, ref: 'Category'}],
  introduction: String,
  content: String,
  create_time: Date
})

module.exports = mongoose.model('Article', articleSchema)
