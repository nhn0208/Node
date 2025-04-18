const express = require('express')
const productRouter = express.Router();

const ProductController = require('../controllers/ProductController')

productRouter.post('/create', ProductController.createProduct)
productRouter.patch('/update', ProductController.updateProductById)
productRouter.get('/model/:slug', ProductController.getProductByModelSlug)
productRouter.get('/model/:id', ProductController.getProductByModelId)
productRouter.get('/:id', ProductController.getProductById)
productRouter.get('/', ProductController.getAllProduct)

module.exports = {
    productRouter
}