const express = require('express')
const router = express.Router()
const articleController = require('../../controllers/frontend/category')

articleController(router)

module.exports = router
