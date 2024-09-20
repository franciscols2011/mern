const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");

mongoose
	.connect(
		"mongodb+srv://francopia5030:franlopez22@ecommerce.wocfw.mongodb.net/"
	)
	.then(() => console.log("Base de datos conectada"))
	.catch((error) => {
		console.log(error);
	});

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS
app.use(
	cors({
		origin: "http://localhost:5173",
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: [
			"Content-Type",
			"Authorization",
			"Cache-Control",
			"Expires",
			"Pragma",
		],
		credentials: true,
	})
);

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);

// Servidor
app.get("/", (req, res) => {
	res.send("Servidor corriendo");
});

app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
