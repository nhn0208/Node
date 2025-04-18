const mongoose = require('mongoose');
require('dotenv').config()
const url = `${process.env.DB_URL}`
function connect() {
    mongoose.set('strictQuery', false)
    mongoose.connect(url, {

    }
    )
    .then(()=> console.log('Connected')
    )
    .catch(()=> console.log("Connected Failed")
    )
}

module.exports = connect