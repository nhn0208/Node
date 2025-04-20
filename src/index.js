const path = require('path');
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser');
require('dotenv').config()

const rootRouter = require('./routes')
const connect = require('./config')

connect();
const corsOptions = {
  origin: ['http://localhost:3000','http://localhost:3001','https://whenever-client.vercel.app'],
  credentials: true,
};
app.use(express.json())
app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
  extended: true
}))
app.use(morgan("combined"))


// Root Router
rootRouter(app)


// LISTEN PORT
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})