const User = require("../models/User");
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library')
const nodemailer = require('nodemailer');

const myOAuth2Client = new OAuth2Client(
    process.env.GOOGLE_MAILER_CLIENT_ID,
    process.env.GOOGLE_MAILER_CLIENT_SECRET
)
myOAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN
  })

const otpStore = new Map(); // Lưu OTP tạm thời
const OTP_EXPIRATION_TIME = 60 * 1000; // 1 phút

class UserController {

    // Check auth
    async checkAuth(req,res) {
        const token = req.cookies.token
        console.log(token)
        if (!token) res.status(401).json({message: "Not Authenticated"})
        else {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET');
            const user = await User.findById(decoded.userId).select('-password');
            if (!user) return res.status(400).json({ message: "User not found" });
            //console.log(token)
            //console.log(user)
            return res.status(200).json(user);
        }

    }

    // Google Sign-In
    async googleSignIn(req, res) {
        try {
            const { email } = req.body;
            console.log(email)
            // Check if the user already exists in the database
            let user = await User.findOne({ username: email });

            if (!user) {
                // If the user doesn't exist, create a new user
                const password =  otpGenerator.generate(8, {
                    specialChars: true
                });
                // Mã hóa mật khẩu
                const hashedPassword = await bcrypt.hash(password, 10);
                user = new User({
                    username: email,
                    password: hashedPassword, // Use Google's unique user ID as a placeholder password
                    role: 'customer', // Default role
                });
                await user.save();

                const myAccessTokenObject = await myOAuth2Client.getAccessToken()
                const myAccessToken = myAccessTokenObject?.token

                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        type: 'OAuth2',
                        user: process.env.ADMIN_EMAIL_ADDRESS,  // Email dùng để gửi OTP
                        clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
                        clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
                        refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
                        accessToken: myAccessToken
                    }
                });
                const mailOptions = {
                    to: email,
                    subject: 'Thank you for signing up!',
                    html: `<h3>Welcome to our service!</h3><p>Your temporary password is: ${password}</p><p>Please change your password after logging in.</p>`
                };
                await transporter.sendMail(mailOptions);
            }

            // Generate a JWT token for the user
            const token = jwt.sign(
                {
                    userId: user._id,
                    role: user.role,
                },
                process.env.JWT_SECRET || 'SECRET',
                { expiresIn: '1d' } // Token expires in 1 day
            );

            // Send the token in an HTTP-only cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'None',
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });

            res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    _id: user._id,
                    username: user.username,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Google Sign-In failed', error: error.message });
        }
    }

    // customer login
    async customerLogin(req,res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({username: username,})
            if (!user) {
                console.log("Username or password isn't correct")
                return res.status(400).json({message: "Username or password isn't correct"})
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch){
                console.log("2: Username or password isn't correct")
                return res.status(400).json({message: "Username or password isn't correct"})
            } 
            
            // Tạo token
            const token = jwt.sign(
                {
                userId: user._id,
                role: user.role,
                },
                process.env.JWT_SECRET || 'SECRET',
                {
                    expiresIn: '1d' // Het han sau 1 ngay
                }
            )

            // Gửi token trong HTTP-Only Cookie ( chống tấn công XSS)
            res.cookie('token', token, {
                httpOnly: true,  // Không cho phép truy cập từ JavaScript
                secure: process.env.NODE_ENV === 'production', // Chỉ dùng HTTPS ở môi trường production
                sameSite: 'None', // Chống CSRF
                maxAge: 24 * 60 * 60 * 1000, // Token hết hạn sau 1 ngày
            });
            //console.log(token)
            res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    _id: user._id,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message})
        }
    }

    // customer login v2 (for android studio)
    async customerLoginV2(req,res) {
        try {
            const { username, password } = req.body
            const user = await User.findOne({username: username,})
            if (!user) {
                console.log("Username or password isn't correct")
                return res.status(400).json({message: "Username or password isn't correct"})
            }
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch){
                console.log("2: Username or password isn't correct")
                return res.status(400).json({message: "Username or password isn't correct"})
            } 
            
            // Tạo token
            const token = jwt.sign(
                {
                userId: user._id,
                role: user.role,
                },
                process.env.JWT_SECRET || 'SECRET',
                {
                    expiresIn: '1d' // Het han sau 1 ngay
                }
            )

            res.status(200).json({
                message: 'Login successful',
                token,
                user: {
                    _id: user._id,
                    username: user.username,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({ message: error.message})
        }
    }

    // Tạo user mới (chỉ admin hoặc staff có quyền)
    async createUser(req, res) {
        try {
            const { username, password, role } = req.body;

            // Kiểm tra quyền (chỉ admin hoặc staff được phép tạo user)
            if (req.user.role !== 'admin' && req.user.role !== 'staff') {
                return res.status(403).json({ message: 'Bạn không có quyền tạo tài khoản!' });
            }

            // Kiểm tra username đã tồn tại chưa
            const existingUser = await User.findOne({ username });
            if (existingUser) return res.status(200).json({ message: 'Tài khoản đã tồn tại!' });

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, password: hashedPassword, role: role || 'customer' });

            await newUser.save();
            res.status(201).json({ message: 'Tạo tài khoản mới thành công!', user: { _id: newUser._id, username: newUser.username, role: newUser.role } });

        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    }

    // Tạo mã OTP và gửi qua email
    async requestOtp(req, res) {
        try {
            const { email } = req.body;
            const existingUser = await User.findOne({ username: email });
            if (existingUser) return res.status(200).json({ message: "Email already registered" });
            
            const myAccessTokenObject = await myOAuth2Client.getAccessToken()
            const myAccessToken = myAccessTokenObject?.token

            // Nếu đã có OTP trước đó, xóa đi
            if (otpStore.has(email)) {
                otpStore.delete(email);
            }

            const otp = otpGenerator.generate(6, { 
                digits: true,       // Bật số (0-9)
                lowerCaseAlphabets: false,  // Tắt chữ thường
                upperCaseAlphabets: false,  // Tắt chữ hoa
                specialChars: false // Tắt ký tự đặc biệt
            });
            const expiresAt = Date.now() + OTP_EXPIRATION_TIME; // Thời gian hết hạn OTP

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    type: 'OAuth2',
                    user: process.env.ADMIN_EMAIL_ADDRESS,  // Email dùng để gửi OTP
                    clientId: process.env.GOOGLE_MAILER_CLIENT_ID,
                    clientSecret: process.env.GOOGLE_MAILER_CLIENT_SECRET,
                    refresh_token: process.env.GOOGLE_MAILER_REFRESH_TOKEN,
                    accessToken: myAccessToken
                }
            });
            const mailOptions = {
                to: email,
                subject: 'Your OTP Code',
                html: `<h3>Your OTP code is: ${otp}</h3>`
            };
            otpStore.set(email, { otp, expiresAt });
            await transporter.sendMail(mailOptions);
            
            res.status(200).json({ message: "OTP sent successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async verifyOtp(req, res) {
        try {
            const { email, otp } = req.body;
            const storedOtpData = otpStore.get(email);
    
            if (!storedOtpData) return res.status(200).json({ message: "OTP expired or not correct" });
    
            const { otp: storedOtp, expiresAt } = storedOtpData;
    
            if (Date.now() > expiresAt) {
                otpStore.delete(email); // Xóa OTP sau khi hết hạn
                return res.status(200).json({ message: "OTP expired or not correct" });
            }
    
            if (storedOtp !== otp) return res.status(200).json({ message: "OTP expired or not correct" });
    
            otpStore.delete(email); // Xóa OTP sau khi xác minh thành công
            res.status(200).json({ message: "OTP verified successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    
    async signUp(req, res) {
        try {
            const { username, password, role } = req.body;
            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, password: hashedPassword, role: role || 'customer' });

            await newUser.save();
            res.status(201).json({ message: 'Sign up successful', user: { _id: newUser._id, username: newUser.username, role: newUser.role } });

        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    }

    // Khách hàng đăng ký tài khoản
    async signUpAccount(req,res) {
        try {
            const { username, password } = req.body;

            // Kiểm tra username đã tồn tại chưa
            const existingUser = await User.findOne({ username });
            if (existingUser) return res.status(400).json({ message: 'Tài khoản đã tồn tại!' });

            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, password: hashedPassword, role: role || 'customer' });

            await newUser.save();
            res.status(201).json({ message: 'Tạo tài khoản mới thành công!', user: { _id: newUser._id, username: newUser.username, role: newUser.role } });

        } catch (error) {
            res.status(500).json({ message: 'Lỗi server', error: error.message });
        }
    }

    //logout
    async logout(req, res) {
        res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'None' });
        res.status(200).json({ message: 'Logged out successfully' });
    }
}

module.exports = new UserController