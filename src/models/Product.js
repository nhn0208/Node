const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')
mongoose.plugin(slug)
const Schema = mongoose.Schema
const Product = new Schema({
    size: {
        type: String,
        require: false,
    },
    instock: {
        type: Number,
        default: 0,
    },
    modelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Model'
    },
    slug: {type: String, slug: 'size', unique: true},
},{
    timestamps: true
})

module.exports = mongoose.model('Product',Product)