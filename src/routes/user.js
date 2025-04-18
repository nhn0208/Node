const express= require('express')
const passport = require('../config/passport');
const userRouter = express.Router()
const UserController = require('../controllers/UserController')

// userRouter.get('/google', passport.authenticate('google', { scope: ['profile','email'] }))
// userRouter.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
//     res.json({ token: req.user.token, user: req.user.user });
// });
userRouter.post('/login', UserController.customerLogin);
userRouter.post('/login/v2', UserController.customerLoginV2);
userRouter.post('/logout', UserController.logout)
userRouter.post('/signup/request-otp', UserController.requestOtp);  // Gửi OTP
userRouter.post('/signup/verify-otp', UserController.verifyOtp);    // Xác minh OTP
userRouter.post('/signup/create-user', UserController.signUp);  // Nhập mật khẩu & tạo user
userRouter.post('/create', UserController.createUser)
userRouter.get('/check-auth', UserController.checkAuth)
module.exports = {
    userRouter
}