import Product from "../models/product.model.js";

export default class ProductManager {
    // Obtener productos con paginación
    async getProducts(page = 1, limit = 10) {
        return await Product.paginate({}, { page, limit, lean: true });
    }

    // Obtener producto por ID
    async getProductById(id) {
        return await Product.findById(id).lean();
    }

    // Agregar producto
    async addProduct(productData) {
        const newProduct = new Product(productData);
        await newProduct.save();
        return newProduct;
    }

    // Actualizar producto
    async updateProduct(id, updatedFields) {
        return await Product.findByIdAndUpdate(id, updatedFields, { new: true }).lean();
    }

    // Eliminar producto
    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id).lean();
    }
}