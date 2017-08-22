const express = require('express')
const router = express.Router()
const articleController = require('../../controllers/frontend/article')

articleController(router)

module.exports = router
