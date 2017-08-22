const jwt = require('jsonwebtoken')

module.exports = id => {
  const token = jwt.sign({
    _id: id
  }, process.env.SECRET_KEY, {
    expiresIn: '10000s'
  })
  return token
}
