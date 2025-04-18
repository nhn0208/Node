const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Order = new Schema(
    {
        customerId: {
            type: String,
            required: true,
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],
        state: {
            type: String,
            enum: ['pending', 'processing', 'delivering', 'delivered', 'canceled'],
            default: 'pending',
        },
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        feeship: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ['COD','Banking'],
            default: 'COD'
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Order', Order);
