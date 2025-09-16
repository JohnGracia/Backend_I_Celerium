import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

// Crear un nuevo carrito
router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart();
        res.status(201).json({ status: "success", cart: newCart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "No se pudo crear el carrito" });
    }
});

// Obtener carrito por ID
router.get("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        res.json({ status: "success", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al cargar el carrito" });
    }
});

// Agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.addProductToCart(cid, pid);
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        res.json({ status: "success", message: "Producto agregado al carrito", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al agregar producto al carrito" });
    }
});

// Actualizar cantidad de un producto
router.put("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;
        const cart = await cartManager.updateProductQuantity(cid, pid, quantity);
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito o producto no encontrado" });
        res.json({ status: "success", message: "Cantidad actualizada", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al actualizar cantidad" });
    }
});

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await cartManager.removeProductFromCart(cid, pid);
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito o producto no encontrado" });
        res.json({ status: "success", message: "Producto eliminado del carrito", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al eliminar producto" });
    }
});

// Vaciar todo el carrito
router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.clearCart(cid);
        if (!cart) return res.status(404).json({ status: "error", message: "Carrito no encontrado" });
        res.json({ status: "success", message: "Carrito vaciado", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Error al vaciar carrito" });
    }
});

export default router;