const Category = require('../models/Category')

class CategoryController {
    // Get all category
    async getAllCategory(req,res) {
        try {
            const category = await Category.find({})
            res.status(200).json(category)
        }catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    // Get category by request's client
    async getCategoryById(req,res) {
        try {
            const category = await Category.find({_id: req.params.id})
            res.status(200).json(category)
        }catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new CategoryController