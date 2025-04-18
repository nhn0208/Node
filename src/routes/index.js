const { modelRouter } = require('./model')
const { productRouter } = require('./product')
const { categoryRouter } = require('./category')
const { cartRouter} = require('./cart')
const { orderRouter } = require('./order')
const { userRouter } = require('./user');


function rootRouter(app) {
    app.use('/auth', userRouter);
    app.use('/products', productRouter)
    app.use('/models', modelRouter)
    app.use('/categories', categoryRouter)
    app.use('/cart', cartRouter)
    app.use('/order', orderRouter)
    //app.use('/',productRouter)
}

module.exports = rootRouter