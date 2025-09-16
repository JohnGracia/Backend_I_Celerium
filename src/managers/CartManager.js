import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export default class CartManager {
    // Crear un nuevo carrito
    async createCart() {
        const newCart = await Cart.create({ products: [] });
        return newCart;
    }

    // Obtener carrito por ID con productos "populados"
    async getCartById(id) {
        const cart = await Cart.findById(id).populate("products.product");
        return cart;
    }

    // Agregar un producto al carrito
    async addProductToCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        const productIndex = cart.products.findIndex(
            (p) => p.product.toString() === productId
        );

        if (productIndex > -1) {
            cart.products[productIndex].quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await cart.save();
        await cart.populate("products.product"); // ⚡ Aquí se reemplaza execPopulate()
        return cart;
    }

    // Actualizar la cantidad de un producto específico en el carrito
    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        const product = cart.products.find(
            (p) => p.product.toString() === productId
        );
        if (product) {
            product.quantity = quantity;
            await cart.save();
            await cart.populate("products.product");
            return cart;
        } else {
            return null;
        }
    }

    // Reemplazar todos los productos del carrito
    async updateCartProducts(cartId, productsArray) {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        cart.products = productsArray.map((p) => ({
            product: p.productId,
            quantity: p.quantity,
        }));

        await cart.save();
        await cart.populate("products.product");
        return cart;
    }

    // Eliminar un producto específico del carrito
    async removeProductFromCart(cartId, productId) {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        cart.products = cart.products.filter(
            (p) => p.product.toString() !== productId
        );
        await cart.save();
        await cart.populate("products.product");
        return cart;
    }

    // Vaciar todo el carrito
    async clearCart(cartId) {
        const cart = await Cart.findById(cartId);
        if (!cart) return null;

        cart.products = [];
        await cart.save();
        return cart;
    }
}