const Category = require('../../models/category')
const checkToken = require('../../middleware/checkToken')
const moment = require('moment')

// 新增分类
const addCategory = (req, res) => {
  const tag = req.body.tag
  if (!tag) {
    res.json({
      code: 0,
      msg: '分类名不能为空'
    })
    return
  }
  Category.findOne({
    tag
  }).then(category => {
    if (category) {
      throw new Error('分类已经存在')
    }
    return new Category({
      tag: tag,
      create_time: new Date()
    }).save()
  }).then(() => {
    res.json({
      code: 1,
      msg: '新增成功'
    })
  }).catch(err => {
    res.json({
      code: 0,
      msg: err.message
    })
  })
}

// 修改分类
const editCategory = (req, res) => {
  const { tag, newTag } = req.body
  if (!tag || !newTag) {
    res.json({
      code: 0,
      msg: '参数有误'
    })
    return
  }
  Category.findOne({
    tag: newTag
  }).then(gategory => {
    if (gategory) {
      throw new Error('分类已存在')
    }
    return Category.findOneAndUpdate({
      tag
    }, {
      $set: { tag: newTag }
    })
  }).then(gategory => {
    if (!gategory) throw new Error('无此需要修改的分类')
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

// 删除分类
const delCategory = (req, res) => {
  const { tag } = req.query
  if (!tag) {
    res.json({
      code: 0,
      msg: '参数有误'
    })
    return
  }
  Category.findOneAndRemove({
    tag
  }).then(gategory => {
    if (!gategory) throw new Error('无此分类')
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

// 获取分类
const getCategory = (req, res) => {
  const { tag } = req.query
  Category.find().sort({'create_time': -1}).then(data => {
    let tagArr = []
    data.map(item => {
      // 根据条件查找 或 无条件查找
      if ((tag && item.tag.includes(tag)) || !tag) {
        tagArr.push({
          tag: item.tag,
          articleTotal: item.article_total,
          createTime: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')
        })
      }
    })
    res.send({
      code: 1,
      data: tagArr
    })
  })
}

module.exports = router => {
  router.use(checkToken)
  router.get('/get', getCategory)
  router.post('/add', addCategory)
  router.put('/edit', editCategory)
  router.delete('/del', delCategory)
}
