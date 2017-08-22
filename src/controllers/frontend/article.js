const Article = require('../../models/article')
const moment = require('moment')

// 获取文章列表 如果传入分类id则查询该分类下的所有文章
const getArticleList = (req, res) => {
  const { categoryId } = req.query
  let query = categoryId ? { tags: { $all: { _id: categoryId } } } : ''
  Article.find(query)
    .populate('tags', 'tag')
    .sort({ 'create_time': -1 })
    .then(doc => {
      let articleList = []
      for (let item of doc) {
        let tags = []
        for (let tag of item.tags) {
          tags.push(tag.tag)
        }
        articleList.push({
          id: item._id,
          title: item.title,
          introduction: item.introduction,
          date: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
          tags
        })
      }
      res.json({
        code: 1,
        data: articleList
      })
    })
}

// 获取一篇文章
const getArticle = (req, res) => {
  const { articleId } = req.query
  Article.findById(articleId).populate('tags', 'tag').then(doc => {
    let tags = []
    for (let tag of doc.tags) {
      tags.push(tag.tag)
    }
    let article = {
      title: doc.title,
      date: moment(doc.create_time).format('YYYY-MM-DD HH:mm:ss'),
      tags: tags,
      content: doc.content
    }
    res.json({
      code: 1,
      data: article
    })
  })
}

module.exports = router => {
  router.get('/getList', getArticleList)
  router.get('/getArticle', getArticle)
}
