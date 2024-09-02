const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const cors = require("cors")

//Conexion a la base de datos

mongoose
.connect("mongodb+srv://francopia5030:franlopez22@ecommerce.wocfw.mongodb.net/")
.then(() => console.log('Base de datos conectada'))
.catch((error) => {
    console.log(error)
})

const app = express();
const PORT = process.env.PORT || 5000;


app.use(
    cors({
        origin: "http://localhost:5137",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", 'Authorization', 'Cache-Control', 'Expires', 'Pragma'
        ],
        credentials: true
    })
);

app.use(cookieParser())

app.use(express.json())


app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`))