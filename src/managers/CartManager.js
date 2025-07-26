import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('data/carts.json');

export default class CartManager {
    async #readFile() {
        try {
            const content = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(content);
        } catch {
            return [];
        }
    }

    async #writeFile(data) {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    }

    async createCart() {
        const carts = await this.#readFile();
        const newCart = {
            id: crypto.randomUUID(),
            products: []
        };
        carts.push(newCart);
        await this.#writeFile(carts);
        return newCart;
    }

    async getCartById(id) {
        const carts = await this.#readFile();
        return carts.find(c => c.id === id);
    }

    async addProductToCart(cartId, productId) {
        const carts = await this.#readFile();
        const cart = carts.find(c => c.id === cartId);
        if (!cart) return null;

        const product = cart.products.find(p => p.product === productId);
        if (product) {
            product.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.#writeFile(carts);
        return cart;
    }
}