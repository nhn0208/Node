const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const Category = new Schema({
  categoryName: String,
});

module.exports = mongoose.model('Category', Category)