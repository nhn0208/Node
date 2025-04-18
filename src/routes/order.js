const express = require('express');
const orderRouter = express.Router();
const OrderController = require('../controllers/OrderController');

// Tạo đơn hàng mới
orderRouter.post('/', OrderController.createOrder);

// Cập nhật trạng thái đơn hàng
orderRouter.put('/:id', OrderController.updateOrderStatus);

// Xóa đơn hàng
orderRouter.delete('/:id', OrderController.deleteOrder);

// Lấy danh sách đơn hàng
orderRouter.get('/', OrderController.getOrders);

// Lấy chi tiết một đơn hàng theo ID
orderRouter.get('/:id', OrderController.getOrderById);

// Lấy chi tiết một đơn hàng theo ID khách hàng
orderRouter.get('/customer/:id', OrderController.getAllOrderByCustomerId)

module.exports = {
    orderRouter
};
