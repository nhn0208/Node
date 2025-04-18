const Model = require('../models/Model')
const Product = require('../models/Product')

class ProductController {

    // Get all product
    async getAllProduct(req,res) {
        try {
            const products = await Product.find({}).populate('modelId')
            res.status(200).json(products)

        }catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message })
        }
    }

    // Get product by id
    async getProductById(req,res) {
        try {
            const product = await Product.find({_id: req.params.id}).populate('modelId')
            res.status(200).json(product)
        }catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    // Get product by model's id
    async getProductByModelId(req,res,next) {
        try {
            const product = await Product.find({ modelId : req.params.id}).populate('modelId')
            res.status(200).json(product)
        }catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message })
        }
    }

    // Get product by model's slug
    async getProductByModelSlug(req,res) {
        try {
            const model = await Model.findOne({slug: req.params.slug})
            console.log(model);
            const product = await Product.find({ modelId : model._id}).populate('modelId')
            res.status(200).json(product)
        }catch (error) {            
            res.status(500).json({ message: error.message })
        }
    }

    // add a new product
    async createProduct(req,res) {
        try {
            const {size,modelId} = req.body
            console.log(req.body);
            if( !size || !modelId) {
                return res.status(400).json({message: 'Missing field'})
            }
            const model = await Model.findOne({_id: modelId})
            if(!model) {
                return res.status(400).json({message: 'Model not found'})
            }
            const product = new Product({size,modelId})
            await product.save()
            model.products.push(product._id)
            await model.save()
            res.status(200).json(product)
        }catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message })
        }
    }

    // Update product by id
    async updateProductById(req,res) {
        try {
            const {_id,instock} = req.body
            if( !instock) {
                return res.status(400).json({message: 'Missing field'})
            }
            const product = await Product.findOneAndUpdate({_id: _id},{ instock},{new: true})
            res.status(200).json(product)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message })
        }     
    }
}

module.exports = new ProductController