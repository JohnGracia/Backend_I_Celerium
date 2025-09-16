import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import CartManager from "../managers/CartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Vista principal con productos paginados y cartId
router.get("/", async (req, res) => {
    try {
        const { docs: products } = await productManager.getProducts(1, 10); // página 1, 10 por página
        const cart = await cartManager.createCart(); // crear carrito temporal
        res.render("home", { products, cartId: cart._id.toString() });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar la vista principal");
    }
});

// Vista en tiempo real
router.get("/realtimeproducts", async (req, res) => {
    try {
        const { docs: products } = await productManager.getProducts(1, 10);
        res.render("realTimeProducts", { products });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar la vista en tiempo real");
    }
});

// Vista carrito
router.get("/cart/:cid", async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);
        if (!cart) return res.status(404).send("Carrito no encontrado");
        res.render("cart", { cart });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al cargar el carrito");
    }
});

export default router;