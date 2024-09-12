const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");

// Conexión a la base de datos
mongoose
  .connect("mongodb+srv://francopia5030:franlopez22@ecommerce.wocfw.mongodb.net/")
  .then(() => console.log("Base de datos conectada"))
  .catch((error) => {
    console.log(error);
  });

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración de CORS
app.use(
  cors({
    origin: "http://localhost:5173",  // Origen exacto del frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control", "Expires", "Pragma"],
    credentials: true  // Permite el uso de credenciales como cookies y encabezados de autenticación
  })
);

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);

// Ruta de prueba para la raíz
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
