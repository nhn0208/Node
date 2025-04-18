const Order = require('../models/Order');
const Product = require('../models/Product')
const Cart = require('../models/Cart')

class OrderController  {
    // Tạo đơn hàng mới
    async createOrder(req, res) {
        try {
            const { customerId, products, name, phone, address, price, feeship } = req.body;

            const cartItems = await Cart.find({ customerId });

            if (!cartItems.length) {
                return res.status(400).json({ message: 'Giỏ hàng trống' });
            }
            const newOrder = new Order({ customerId, products, name, phone, address, price, feeship });
            await newOrder.save();

            for (let item of cartItems) {
                await Product.findOneAndUpdate(
                    { _id: item.productId._id },
                    { $inc: { stock: -item.quantity } }, // Giảm số lượng tồn kho
                    { new: true }
                );
            }
            await Cart.deleteMany({ customerId });
            res.status(201).json(newOrder);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Lấy danh sách đơn hàng
    async getOrders(req, res) {
        try {
            const orders = await Order.find().populate('customerId').populate('products.productId');
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Lấy thông tin một đơn hàng theo ID
    async getOrderById(req, res) {
        try {
            const order = await Order.findById(req.params.id).populate('customerId').populate('products.productId');
            if (!order) return res.status(404).json({ message: 'Order not found' });
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Lấy tất cả đơn hàng theo id khách hàng
    async getAllOrderByCustomerId(req,res) {
        try {
            const order = await Order.find({ customerId: req.params.id}).populate('products.productId')
            if (!order) return res.status(404).json({message: 'Order not found'})
            res.status(200).json(order)
        }catch(error) {
            res.status(500).json({ message: error.message})
        }
    }

    // Cập nhật trạng thái đơn hàng
    async updateOrderStatus(req, res) {
        try {
            const { state } = req.body;
            const order = await Order.findByIdAndUpdate(req.params.id, { state }, { new: true });
            if (!order) return res.status(404).json({ message: 'Order not found' });
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Xóa đơn hàng
    async deleteOrder(req, res) {
        try {
            const order = await Order.findByIdAndDelete(req.params.id);
            if (!order) return res.status(404).json({ message: 'Order not found' });
            res.status(200).json({ message: 'Order deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = new OrderController;
