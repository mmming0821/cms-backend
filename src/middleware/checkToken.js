const jwt = require('jsonwebtoken')
module.exports = (req, res, next) => {
  const authorization = req.headers['authorization']
  if (!authorization) {
    return res.json({
      code: 4,
      msg: '无用户信息'
    })
  }
  const token = authorization.split(' ')[1]
  // 解析token
  const decoded = jwt.decode(token)
  // 判断token是否过期
  if (token && decoded.exp <= Date.now() / 1000) {
    return res.json({
      code: 4,
      msg: 'token过期，请重新登录'
    })
  }
  req._id = decoded._id
  next()
}
