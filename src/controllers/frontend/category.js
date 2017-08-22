const Category = require('../../models/category')

const getCategory = (req, res) => {
  Category.find().sort({ create_time: -1 }).then(doc => {
    let categories = []
    doc.map(v => {
      categories.push({
        id: v._id,
        tag: v.tag,
        total: v.article_total
      })
    })
    res.json({
      code: 1,
      data: categories
    })
  })
}

module.exports = router => {
  router.get('/getCategories', getCategory)
}
