const express = require('express')

const cartRouter = express.Router()
const cartController = require('../controllers/CartController')

cartRouter.post("/add", cartController.addProductToCart)
cartRouter.delete("/delete/:id", cartController.deleteProductInCart)
cartRouter.patch('/increase/:id', cartController.increaseProductInCart)
cartRouter.patch('/decrease/:id', cartController.decreaseProductInCart)
cartRouter.get("/:customerId", cartController.getAllByCustomerId)
cartRouter.get("/v2/:customerId", cartController.getAllByCustomerIdWithModel)

module.exports = {
    cartRouter
}