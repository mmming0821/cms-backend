const express = require('express')
const router = express.Router()
const articleController = require('../../controllers/ms/article')

articleController(router)

module.exports = router
