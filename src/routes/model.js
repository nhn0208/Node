const express = require('express')
const modelRouter = express.Router()
const ModelController = require('../controllers/ModelController')

modelRouter.post('/create', ModelController.createModel)
modelRouter.patch('/update', ModelController.updateModelById)
modelRouter.delete('/delete/:id', ModelController.deleteModelById)
modelRouter.get('/:slug', ModelController.getModelBySlug)
modelRouter.get('/category/:name', ModelController.getModelByCategory)
modelRouter.get('/:id', ModelController.getModelById)
modelRouter.get('/', ModelController.getAllModel)
modelRouter.get('/search/:search', ModelController.getModelBySearch)

module.exports = {
    modelRouter
}