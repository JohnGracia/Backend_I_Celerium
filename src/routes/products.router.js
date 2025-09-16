import { Router } from "express";
import Product from "../models/product.model.js";

const router = Router();

// Obtener todos los productos (paginación)
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const products = await Product.paginate({}, { page, limit, lean: true });
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al obtener productos");
    }
});

// Crear nuevo producto
router.post("/", async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        await newProduct.save();
        res.status(201).json({ status: "success", product: newProduct });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al crear producto");
    }
});

// Eliminar producto por ID
router.delete("/:pid", async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.pid);
        if (!deleted) return res.status(404).send("Producto no encontrado");
        res.json({ status: "success", product: deleted });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error al eliminar producto");
    }
});

export default router;