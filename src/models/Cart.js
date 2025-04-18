const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Cart = new Schema({
    customerId: {
        type : String,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    quantity: {
        type: Number,
        default: 1,
    },
},{
    timestamps: true
})

module.exports = mongoose.model('Cart', Cart)