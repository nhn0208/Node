const Model = require('../models/Model')
const Product = require('../models/Product')
const Category = require('../models/Category')
class ModelController {

    // get all model
    async getAllModel(req,res) {
        try {
            const model = await Model.find().sort({createdAt: -1}).populate('products')
            if (!model) res.send({ message : 'No one model found'})
            res.send(model)
        }catch (error) {
            res.status(500).json({ message: error.message})
        }
    }

    // get model by slug
    async getModelBySlug(req,res) {
        try {
            const model = await Model.findOne({ slug : req.params.slug}).populate('products')
            if (!model) res.send({ message : 'No one model found'})
                res.send(model)
        }catch (error) {
            res.status(500).json({ message: error.message})
        }
    }

    // get model by id
    async getModelById(req,res,next) {
        try {
            const model = await Model.find({ _id : req.params.id}).populate('products')
            if (!model) res.send({ message : 'No one model found'})
                res.send(model)
        }catch (error) {
            res.status(500).json({ message: error.message})
        }
    }

    // get model by category
    async getModelByCategory(req,res,next) {
        try {
            const category = await Category.findOne({categoryName: req.params.name})
            if (category) {
                const model = await Model.find({category: category._id}).populate('products')
                if (!model) res.send({message: "Model not found"})
                res.send(model)
            }
        }catch (error) {
            res.status(500).json({ message: error.message})
        }
    }

    // get models by search input
    async getModelBySearch(req,res) {
        try {
            const search = req.params.search
            const model = await Model.find({$or: [
                {name: {$regex: search, $options: 'i'}},
                {description: {$regex: search, $options: 'i'}},
                {slug: {$regex: search, $options: 'i'}},
            ]}).populate('products')
            if (!model) res.status(400).json({ message : 'No one model found'})
            res.status(200).json(model)
        }catch (error) {
            res.status(500).json({ message: error.message})
        }
    }

    // Post a new model
    async createModel(req,res) {
        //console.log(req.body);
        
        const model = new Model(req.body)
        await model.save()
        .then( data => {
            res.send({data})
        })
    }

    // Update model by id
    async updateModelById(req,res) {
        try {
            const filter = { _id: req.body._id}
            const update = req.body
            const model = await Model.findByIdAndUpdate(filter,update)
            if (!model) res.send({message: 'Model not found'})
            res.send(model)
        }catch (error) {
            res.status(500).json({ message: error.message})
        }
    }

    // Delete model by id
    async deleteModelById(req,res) {
        try {
            const model = await Model.findByIdAndDelete(req.params.id);
            if (!model) return res.status(404).json({ message: 'Model not found' });
            res.status(200).json({ message: 'Model deleted successfully' });
            // Delete all product of model
            const product = await Product
            .deleteMany({modelId: req.params.id})
            if (!product) return res.status(404).json({ message: 'Product not found' });
            res.status(200).json({ message: 'Product deleted successfully' });
        }
        catch (error) {
            res.status(500).json({ message: error.message})
        }
    }
}

module.exports = new ModelController