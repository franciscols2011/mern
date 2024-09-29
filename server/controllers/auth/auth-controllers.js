const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// register
const registerUser = async (req, res) => {
	const { userName, email, confirmEmail, password, confirmPassword } = req.body;

	try {
		if (!userName || !email || !confirmEmail || !password || !confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "All fields are required",
			});
		}

		if (email !== confirmEmail) {
			return res.status(400).json({
				success: false,
				message: "Emails do not match",
			});
		}

		const emailRegex = /\S+@\S+\.\S+/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({
				success: false,
				message: "Invalid email format",
			});
		}

		if (password !== confirmPassword) {
			return res.status(400).json({
				success: false,
				message: "Passwords do not match",
			});
		}

		if (password.length < 8 || password.length > 15) {
			return res.status(400).json({
				success: false,
				message: "Password must be between 8 and 15 characters",
			});
		}

		const checkEmail = await User.findOne({ email });
		if (checkEmail) {
			return res.status(400).json({
				success: false,
				message: "User already exists with this email",
			});
		}

		const checkUserName = await User.findOne({ userName });
		if (checkUserName) {
			return res.status(400).json({
				success: false,
				message: "Username is already taken",
			});
		}

		const hashPassword = await bcrypt.hash(password, 12);
		const newUser = new User({
			userName,
			email,
			password: hashPassword,
		});

		await newUser.save();
		res.status(200).json({
			success: true,
			message: "User created successfully",
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occurred",
		});
	}
};

// login
const loginUser = async (req, res) => {
	const { identifier, password } = req.body;

	try {
		if (!identifier || !password) {
			return res.status(400).json({
				success: false,
				message: "Username/Email and password are required",
			});
		}

		// Buscar al usuario por correo electrónico o nombre de usuario
		const checkUser = await User.findOne({
			$or: [{ email: identifier }, { userName: identifier }],
		});

		const isMatch = checkUser
			? await bcrypt.compare(password, checkUser.password)
			: false;

		if (!checkUser || !isMatch) {
			return res.status(401).json({
				success: false,
				message: "Invalid username/email or password",
			});
		}

		const token = jwt.sign(
			{
				id: checkUser._id,
				role: checkUser.role,
				email: checkUser.email,
				userName: checkUser.userName,
			},
			process.env.CLIENT_SECRET_KEY,
			{ expiresIn: "60m" }
		);

		res
			.cookie("token", token, {
				httpOnly: true,
				secure: false,
			})
			.json({
				success: true,
				message: "Logged in successfully",
				user: {
					email: checkUser.email,
					role: checkUser.role,
					id: checkUser.id,
					userName: checkUser.userName,
				},
			});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occurred",
		});
	}
};

// logout
const logoutUser = (req, res) => {
	res.clearCookie("token").json({
		success: true,
		message: "Logged out successfully",
	});
};

// auth middleware
const authMiddleware = async (req, res, next) => {
	const token = req.cookies.token;
	if (!token)
		return res.status(401).json({
			success: false,
			message: "Please login to continue",
		});
	try {
		const decoded = jwt.verify(token, process.env.CLIENT_SECRET_KEY);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({
			success: false,
			message: "Please login to continue",
		});
	}
};

const checkIfUserExists = async (req, res) => {
	const { userName, email } = req.query;

	try {
		if (userName) {
			const user = await User.findOne({ userName });
			if (user) {
				return res.status(200).json({
					success: false,
					message: "Username is already taken",
				});
			}
		}

		if (email) {
			const user = await User.findOne({ email });
			if (user) {
				return res.status(200).json({
					success: false,
					message: "Email is already in use",
				});
			}
		}

		res.status(200).json({
			success: true,
			message: "Username or email is available",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({
			success: false,
			message: "Something went wrong",
		});
	}
};

module.exports = {
	registerUser,
	loginUser,
	logoutUser,
	authMiddleware,
	checkIfUserExists,
};
