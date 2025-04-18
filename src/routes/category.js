const express = require('express')

const categoryRouter = express.Router()
const CategoryController = require('../controllers/CategoryController')

categoryRouter.get('/:id', CategoryController.getCategoryById)
categoryRouter.get('/',CategoryController.getAllCategory)

module.exports = {
    categoryRouter
}
