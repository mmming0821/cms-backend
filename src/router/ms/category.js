const express = require('express')
const router = express.Router()
const categoryController = require('../../controllers/ms/category')

categoryController(router)

module.exports = router
