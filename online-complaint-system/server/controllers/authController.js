const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. User Registration Logic
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role: role || 'Ordinary' // Defaults to Ordinary if not provided
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error("Registration Error:", error.message);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// 2. User Login Logic
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Create the JWT Payload (Data embedded in the token)
        const payload = {
            user: {
                id: user._id,
                role: user.role
            }
        };

        // Generate the Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }, // Token expires in 1 day
            (err, token) => {
                if (err) throw err;
                // Send the token and user data back to the React frontend
                res.json({
                    token,
                    user: { id: user._id, name: user.name, role: user.role, email: user.email }
                });
            }
        );

    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: 'Server error during login' });
    }
};