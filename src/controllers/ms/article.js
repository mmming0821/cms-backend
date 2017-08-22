const Article = require('../../models/article')
const Category = require('../../models/category')
const checkToken = require('../../middleware/checkToken')
const moment = require('moment')

// 获取所有文章
const getArticleList = (req, res) => {
  const { title, limit, index } = req.query
  let skip = (index - 1) * limit
  let result = {
    code: 0,
    list: [],
    count: 0
  }
  // 根据条件(title)查找 或 无条件查找
  let queryTitle = {}
  if (title) queryTitle = {title: { $regex: title, $options: 'i' }}
  Article.find(queryTitle).sort({'create_time': -1}).limit(~~limit).skip(skip)
    .populate('tags', 'tag', null, {sort: { create_time: -1 }})
    .then(data => {
      let list = []
      data.map(item => {
        let tagList = ''
        item.tags.map(category => {
          tagList += category.tag + '、'
        })
        tagList = tagList.substring(0, tagList.length - 1)
        list.push({
          title: item.title,
          tags: tagList,
          content: item.content,
          createTime: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')
        })
      })
      result.list = list
      // 获取总条数
      return Article.count(queryTitle)
    }).then(count => {
      result.count = count
      result.code = 1
      res.json(result)
    })
}

// 添加文章
const addArticle = (req, res) => {
  let { title, tags, introduction, content } = req.body
  let tagsId = []
  Article.findOne({
    title
  }).then(data => {
    if (data) {
      throw new Error('此文章标题已存在')
    }
    return Category.find({'tag': {'$in': tags}}).then(categories => {
      categories.map(item => {
        item.article_total++
        item.save()
        tagsId.push(item._id)
      })
    })
  }).then(() => {
    return new Article({
      title,
      tags: tagsId,
      introduction,
      content,
      create_time: new Date()
    }).save()
  }).then(() => {
    res.json({
      code: 1,
      msg: '保存成功'
    })
  }).catch(err => {
    res.json({
      code: 0,
      msg: err.message
    })
  })
}

// 删除文章
const delCategory = (req, res) => {
  const { title } = req.query
  if (!title) {
    res.json({
      code: 0,
      msg: '参数有误'
    })
    return
  }
  Article.findOneAndRemove({
    title
  }).then(article => {
    if (!article) throw new Error('无此分类')
    return Category.find({'_id': {'$in': article.tags}}).then(categories => {
      categories.map(category => {
        category.article_total--
        category.save()
      })
    })
  }).then(() => {
    res.json({
      code: 1,
      msg: '删除成功'
    })
  }).catch(err => {
    res.json({
      code: 0,
      msg: err.message
    })
  })
}

// 获取一项article
const getArticle = (req, res) => {
  const { title } = req.query
  Article.findOne({ title }).populate('tags', 'tag')
    .then(article => {
      let tags = []
      article.tags.map(tagObj => tags.push(tagObj.tag))
      res.json({
        code: 1,
        article: {
          title: article.title,
          introduction: article.introduction,
          content: article.content,
          tags: tags
        }
      })
    })
}

// 编辑文章
const editCategory = (req, res) => {
  const { oldTitle, title, introduction, content, tags } = req.body
  if (title !== oldTitle) {
    Article.findOne({ title }).then(article => {
      if (article) {
        res.json({
          code: 0,
          msg: '标题名已存在'
        })
      }
    })
  }
  Article.findOne({title: oldTitle})
    .populate('tags', 'tag')
    .then(article => {
      let oldTagsArr = []
      article.tags.map(tagObj => oldTagsArr.push(tagObj.tag))
      // 需要分类下文章数加1的数组
      let addArticleTotalArr = tags.filter(v => !oldTagsArr.includes(v))
      // 需要分类下文章数减1的数组
      let reduceArticleTotalArr = oldTagsArr.filter(v => !tags.includes(v))
      Category.find({'tag': {'$in': addArticleTotalArr}}).then(categories => {
        categories.map(category => {
          category.article_total++
          category.save()
        })
      })
      Category.find({'tag': {'$in': reduceArticleTotalArr}}).then(categories => {
        categories.map(category => {
          category.article_total--
          category.save()
        })
      })
      getTagsId(tags).then((tagsIdArr) => {
        return Article.update(article, {
          title,
          introduction,
          content,
          tags: tagsIdArr
        })
      })
    }).then(() => {
      res.json({
        code: 1,
        msg: '修改成功'
      })
    }).catch(err => {
      res.json({
        code: 0,
        msg: err.message
      })
    })
}

/**
 * @param {array} tags 分类名
 * @return {array} tagsId 分类id
 */
const getTagsId = (tags) => {
  return new Promise((resolve) => {
    Category.find({'tag': {'$in': tags}}).then(categories => {
      let tagsId = []
      categories.map(item => tagsId.push(item._id))
      resolve(tagsId)
    })
  })
}

module.exports = router => {
  router.use(checkToken)
  router.get('/getlist', getArticleList)
  router.post('/add', addArticle)
  router.put('/edit', editCategory)
  router.delete('/del', delCategory)
  router.get('/get', getArticle)
}
