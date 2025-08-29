import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const productManager = new ProductManager(path.join(__dirname, '../managers/products.json'));

// Obtener todos los productos
router.get('/', async (req, res) => {
    const products = await productManager.getProducts();
    res.json(products);
});

// Agregar producto
router.post('/', async (req, res) => {
    const newProduct = req.body;
    await productManager.addProduct(newProduct);

    const updatedProducts = await productManager.getProducts();

    // Emitir actualización vía Socket.io
    req.io.emit('updateProducts', updatedProducts);

    res.json({ status: 'success', message: 'Producto agregado', products: updatedProducts });
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await productManager.deleteProduct(id);

    const updatedProducts = await productManager.getProducts();

    // Emitir actualización vía Socket.io
    req.io.emit('updateProducts', updatedProducts);

    res.json({ status: 'success', message: 'Producto eliminado', products: updatedProducts });
});

export default router;
