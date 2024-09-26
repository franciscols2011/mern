const Product = require("../../models/Product");

const escapeRegex = (text) => {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

const searchProducts = async (req, res) => {
	try {
		const { keyword, page = 1, limit = 10 } = req.query;

		if (!keyword || typeof keyword !== "string" || keyword.trim() === "") {
			return res.status(400).json({
				success: false,
				message: "Invalid keyword provided",
			});
		}

		const sanitizedKeyword = escapeRegex(keyword.trim());
		const regEx = new RegExp(sanitizedKeyword, "i");
		const createSearchQuery = {
			$or: [
				{ title: regEx },
				{ description: regEx },
				{ category: regEx },
				{ brand: regEx },
			],
		};

		const pageNum = parseInt(page);
		const limitNum = parseInt(limit);
		const skip = (pageNum - 1) * limitNum;

		const [searchResults, total] = await Promise.all([
			Product.find(createSearchQuery).skip(skip).limit(limitNum),
			Product.countDocuments(createSearchQuery),
		]);

		res.status(200).json({
			success: true,
			data: searchResults,
			pagination: {
				total,
				page: pageNum,
				pages: Math.ceil(total / limitNum),
			},
		});
	} catch (e) {
		console.error(e);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

module.exports = { searchProducts };
