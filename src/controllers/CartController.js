const Cart = require('../models/Cart')
const { populate } = require('../models/Model')

class CartController {
    //add 1 product to cart
    async addProductToCart(req,res) {
        try {
            const { productId, customerId, quantity} = req.body
            const cart = await Cart.findOneAndUpdate(
                {
                    productId: productId,
                    customerId: customerId
                },
                {
                    $inc: { quantity: quantity ?? 1}
                },
                {
                    upsert: true,
                    new: true,
                }
            )
            res.status(200).json({message: "Them thanh cong"})
        }catch(error) {
            res.status(500).json({ message: error.message})
        }
    }

    // Increase to product in cart by 1
    async increaseProductInCart(req,res) {
        try {
            const cart = await Cart.findOneAndUpdate({_id: req.params.id},{ $inc: { quantity: 1 }},{new: true})
            if (!cart) res.status(500).json({message: "No cart found"})
            res.status(201).json({ message: "Increase 1"})
        } catch (error) {
            res.status(500).json({ message: error.message})
            
        }
    }

    //decrease
    async decreaseProductInCart(req,res) {
        try {
            const cart = await Cart.findOneAndUpdate({_id: req.params.id},{ $inc: { quantity: -1 }},{new: true})
            if (!cart) res.status(500).json({message: "No cart found"})
            res.status(201).json({ message: "Decrease 1"})
        } catch (error) {
            res.status(500).json({ message: error.message})
            
        }
    }

    async getAllByCustomerId(req,res) {
        try {
            const cart = await Cart.find({customerId: req.params.customerId}).populate({path: 'productId',populate: { path: 'modelId' }})
            if (!cart) res.status(500).json({message: "No cart found"})
                res.send(cart)
        } catch (error) {
            res.status(500).json({ message: error.message})
            
        }
    }

    // v2
    async getAllByCustomerIdWithModel(req,res) {
        try {
            const cart = await Cart.find({customerId: req.params.customerId}).populate({path: 'productId',populate: { path: 'modelId', populate: {path: 'products'} }})
            if (!cart) res.status(500).json({message: "No cart found"})
                res.send(cart)
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: error.message})
            
        }
    }

    // delete
    async deleteProductInCart(req,res) {
        try {
            const cart = await Cart.findByIdAndDelete(req.params.id)
            if (!cart) res.status(500).json({message: "No cart found"})
                res.status(201).json({ message: 'Da xoa' });
        } catch (error) {
            res.status(500).json({ message: error.message})
            
        }
    }
}

module.exports = new CartController