import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// register new user
export const registerUser = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// if user exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: 'User already exists',
			});
		}

		// Hash password
		let hashedPassword;
		try {
			hashedPassword = await bcrypt.hash(password, 10);
		} catch (error) {
			return res.status(500).json({
				success: false,
				message: 'Error in hashing the password',
			});
		}
		// Create user
		const newUser = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		res.status(200).json({
			success: true,
			message: 'User registered',
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: 'Error registering user',
			error: error.message,
		});
	}
};

// Login user
export const loginUser = async (req, res) => {
	try {
		const { email, password } = req.body;

		// if user exists
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				success: false,
				message: 'Invalid credentials',
			});
		}

		// compare password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({
				success: false,
				message: 'Invalid credentials',
			});
		}
		// create payload
		const payload = {
			email: user.email,
			userId: user._id,
		};
		// create token
		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: '2h',
		});

		// converting the user into object
		let userObj = user.toObject();
		userObj.token = token;
		userObj.password = undefined;

		const options = {
			expires: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // expires in 5 days
			httpOnly: true,
		};

		res.cookie('token', token, options).status(200).json({
			success: true,
			token,
			user: userObj,
			message: 'User Logged in successfully',
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			message: 'Error while login',
			error,
		});
	}
};

// Get user profile
export const getUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.userId);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: 'User not found',
			});
		}

		res.status(200).json({ user });
	} catch (error) {
		res.status(500).json({
			success: false,
			message: 'Error fetching profile',
			error,
		});
	}
};
