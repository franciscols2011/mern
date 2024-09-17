const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
	{
		image: String,
		title: String,
		description: String,
		category: String,
		brand: String,
		price: Number,
		salePrice: Number,
		totalStock: Number,
	},
	{ timestamps: true }
);

// Check if the model already exists before defining it
module.exports =
	mongoose.models.Product || mongoose.model("Product", ProductSchema);
