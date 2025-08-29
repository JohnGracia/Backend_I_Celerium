import express from 'express';
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';
import ProductManager from './managers/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server);
const productManager = new ProductManager();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configurar Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', (req, res, next) => {
    req.io = io;
    next();
}, productsRouter);

// Socket.io
io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar lista de productos actual al cliente
    const products = await productManager.getProducts();
    socket.emit('updateProducts', products);

    // Escuchar evento para agregar producto
    socket.on('newProduct', async (product) => {
        await productManager.addProduct(product);
        const updatedProducts = await productManager.getProducts();
        io.emit('updateProducts', updatedProducts);
    });

    // Escuchar evento para eliminar producto
    socket.on('deleteProduct', async (id) => {
        await productManager.deleteProduct(id);
        const updatedProducts = await productManager.getProducts();
        io.emit('updateProducts', updatedProducts);
    });
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

