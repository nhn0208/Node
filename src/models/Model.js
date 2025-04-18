const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)

const Schema = mongoose.Schema
const Model = new Schema({
    name: { type: String, required: true},
    description: { type: String, default: ''},
    image: {
        type: [String],
        default: []
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Tham chieu den Model Category
    },
    products: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product'
    },
    price: {
        type: Number,
    },
    slug: {type: String, slug: 'name', unique: true},
},{
    timestamps: true
})

module.exports = mongoose.model('Model', Model)