const User = require('../../models/user')
const createToken = require('../../middleware/createToken')
const checkToken = require('../../middleware/checkToken')
const multer = require('multer')
const fs = require('fs')

// 注册
const registerValidate = (req, res, next) => {
  const { name, password } = req.body
  if (!name || !password) {
    res.json({
      code: 0,
      msg: '格式错误'
    })
  } else {
    next()
  }
}
const Register = (req, res) => {
  let userRegister = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    create_time: new Date()
  })
  if (userRegister.name === 'admin') {
    userRegister.isAdmin = true
  }
  User.findOne({
    name: userRegister.name
  }).then(user => {
    if (user) {
      res.json({
        code: 0,
        msg: '用户已注册'
      })
    } else {
      userRegister.save((err, user) => {
        if (err) {
          res.json(err)
        } else {
          const token = createToken(userRegister._id)
          res.json({
            code: 1,
            msg: '注册成功',
            token: token
          })
        }
      })
    }
  }).catch(err => res.json(err))
}

// 登录
const Login = (req, res) => {
  let userLogin = new User({
    name: req.body.name,
    password: req.body.password
  })
  User.findOne({
    name: userLogin.name
  }).then(user => {
    if (user.password === userLogin.password) {
      res.json({
        code: 1,
        msg: '登录成功',
        token: createToken(user._id)
      })
    } else {
      res.json({
        code: 0,
        msg: '登录信息有误'
      })
    }
  }).catch(() => res.json({
    code: 0,
    msg: '登录信息有误'
  }))
}

// 获取用户信息
const user = (req, res) => {
  User.findById({
    _id: req._id
  }).then(user => {
    let name = !!user.nickname ? user.nickname : user.name
    let avatarFileName = !!user.avatar ? user.avatar : 'default.jpg'
    res.json({
      code: 1,
      data: {
        name,
        avatar: `${process.env.domain}/avatar/${avatarFileName}`
      }
    })
  }).catch(() => {
    res.json({
      code: 0,
      msg: '未找到该用户'
    })
  })
}

// 上传用户头像图片
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/avatar')
  },
  filename: function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|png)$/)) {
      let err = new Error()
      err.code = 'fileType'
      return cb(err)
    } else {
      req.avatar = Date.now() + '-' + file.originalname
      cb(null, req.avatar)
    }
  }
})

const upload = multer({
  storage,
  limits: { fileSize: '2MB' }
}).single('avatar')

const imgUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        res.json({
          code: 0,
          msg: '图片过大'
        })
      } else if (err.code === 'fileType') {
        res.json({
          code: 0,
          msg: '图片格式不正确'
        })
      }
    } else {
      if (!req.file) {
        res.json({
          code: 0,
          msg: '没有选择图片'
        })
      } else {
        User.findByIdAndUpdate({ _id: req._id }, {
          avatar: req.avatar
        }).then((doc) => {
          if (doc.avatar) {
            fs.unlink('public/avatar/' + doc.avatar, (err) => {
              if (err) console.log(err)
            })
          }
          res.json({
            code: 1,
            msg: '上传图片成功',
            url: `${process.env.domain}/avatar/${req.avatar}`
          })
        })
      }
    }
  })
}

const updateUserInfo = (req, res) => {
  let { nickname } = req.body
  User.findByIdAndUpdate({ _id: req._id }, { nickname }).then(user => {
    let avatarFileName = !!user.avatar ? user.avatar : 'default.jpg'
    res.json({
      code: 1,
      msg: '修改成功',
      data: {
        name: nickname,
        avatar: `${process.env.domain}/avatar/${avatarFileName}`
      }
    })
  })
}

module.exports = (router) => {
  // 注册
  router.post('/register', registerValidate, Register)
  // 登录
  router.post('/login', Login)
  // 获取用户信息
  router.get('/userInfo', checkToken, user)
  // 上传头像
  router.post('/profile', checkToken, imgUpload)
  // 修改个人资料
  router.put('/update', checkToken, updateUserInfo)
}
