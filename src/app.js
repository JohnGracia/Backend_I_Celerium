import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import handlebars from "express-handlebars";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

import connectMongo from "./config/db.js";
import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

// Modelos Mongoose
import Product from "./models/product.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);

const PORT = 8080;

// 🔹 Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// 🔹 Handlebars
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// 🔹 Rutas
app.use("/", viewsRouter);
app.use("/api/carts", cartsRouter);
app.use(
    "/api/products",
    (req, res, next) => {
        req.io = io;
        next();
    },
    productsRouter
);

// 🔹 Socket.io
io.on("connection", async (socket) => {
    console.log("🟢 Nuevo cliente conectado");

    // Enviar lista de productos actual
    const products = await Product.find().lean();
    socket.emit("updateProducts", products);

    // Agregar producto
    socket.on("newProduct", async (product) => {
        try {
            await Product.create(product);
            const updated = await Product.find().lean();
            io.emit("updateProducts", updated);
        } catch (err) {
            console.error("Error al agregar producto:", err);
        }
    });

    // Eliminar producto
    socket.on("deleteProduct", async (id) => {
        try {
            await Product.findByIdAndDelete(id);
            const updated = await Product.find().lean();
            io.emit("updateProducts", updated);
        } catch (err) {
            console.error("Error al eliminar producto:", err);
        }
    });
});

// 🔹 Endpoint de prueba
app.get("/ping", (req, res) => {
    res.send("🏓 Pong desde el backend!");
});

// 🔹 Conectar a Mongo y arrancar server
connectMongo()
    .then(() => {
        server.listen(PORT, () => {
            console.log("✅ MongoDB conectado");
            console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("❌ Error al conectar a MongoDB:", err);
    });