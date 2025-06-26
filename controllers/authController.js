import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import otpGenerator from 'otp-generator';
import OTPmodel from '../models/OTPmodel.js';

// send otp
export const sendOtp = async (req, res) => {
	try {
		const { email } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: 'User already registered',
			});
		}

		var otp = otpGenerator.generate(6, {
			upperCaseAlphabets: false,
			lowerCaseAlphabets: false,
			specialChars: false,
		});
		console.log('OTP generated', otp);

		// otp must be unique
		let result = await OTPmodel.findOne({ otp });

		while (result) {
			otp = otpGenerator.generate(6, {
				upperCaseAlphabets: false,
				lowerCaseAlphabets: false,
				specialChars: false,
			});
			result = await OTPmodel.findOne({ otp });
		}

		const otpPayload = { email, otp };
		const otpBody = await OTPmodel.create(otpPayload);
		console.log(otpBody);

		return res.status(200).json({
			success: true,
			message: 'Otp send successfully',
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: 'Error while sending otp',
		});
	}
};

// register new user
export const registerUser = async (req, res) => {
	try {
		const { firstName, lastName, email, password, otp } = req.body;

		if (!firstName || !lastName || !email || !password || !otp) {
			return res.status(400).json({
				success: false,
				message: 'All fields are required',
			});
		}

		// if user exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({
				success: false,
				message: 'User already exists',
			});
		}

		// find the recent otp
		const recentOtp = await OTPmodel.findOne({ email }).sort({ createdAt: -1 });

		console.log('Stored OTP : ', recentOtp?.otp);
		console.log('Entered OTP : ', otp);

		// validate the otp
		if (!recentOtp) {
			return res.status(400).json({
				success: false,
				message: 'Otp not found',
			});
		} else if (otp !== recentOtp.otp) {
			return res.status(400).json({
				success: false,
				message: 'Invalid OTP',
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
			firstName,
			lastName,
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
			expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // expires in 5 days
			// for now switching it to the 1 hour of testing purposes
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
