const express = require('express')
const router = express.Router()
const userController = require('../../controllers/ms/user')

userController(router)

module.exports = router
