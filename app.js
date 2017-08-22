const express = require('express')
const mongoose = require('mongoose')
const pkg = require('./package')
const config = require('./config/default')
const bodyParser = require('body-parser')
// 管理系统路由
const msRouter = {
  user: require('./src/router/ms/user'),
  category: require('./src/router/ms/category'),
  article: require('./src/router/ms/article')
}
// 前端路由
const frontendRouter = {
  category: require('./src/router/frontend/category'),
  article: require('./src/router/frontend/article')
}

const path = require('path')
const port = process.env.PORT || 3001
const app = express()
config.setConfig()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static(path.join(__dirname) + '/public'))

// mongodb
console.log(process.env.MONGOOSE_CONNECT)
mongoose.connect(process.env.MONGOOSE_CONNECT)
mongoose.Promise = global.Promise
const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connect error'))
db.once('open', function () {
  console.log('Mongodb started successfully')
})

// 设置图片上传允许跨域
// const allowOrigin = (req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
//   res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
//   if (req.method === 'OPTIONS') res.send(200) // 让options请求快速返回
//   else next()
// }

// 设定管理系统对应路由
app.use('/ms/user', msRouter.user)
app.use('/ms/category', msRouter.category)
app.use('/ms/article', msRouter.article)

app.use('/api/category', frontendRouter.category)
app.use('/api/article', frontendRouter.article)

// 端口
app.listen(port, () => {
  console.log(`${pkg.name} listening on port ${port}`)
})
