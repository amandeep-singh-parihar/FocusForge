import jwt from 'jsonwebtoken';

export const authenticate = async (req, res, next) => {
	try {
		const token =
			req.cookies?.token ||
			req.body?.token ||
			req.header('Authorization')?.replace('Bearer ', '').trim();

		// Debug
		// console.log(' Incoming Token:', token);
		// debug

		if (!token) {
			return res.status(401).json({
				success: false,
				message: 'Auth token missing!',
			});
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.userId;
		next();
	} catch (error) {
		return res.status(401).json({
			success: false,
			message: 'Invalid or expired token',
			error: error.message,
		});
	}
};
