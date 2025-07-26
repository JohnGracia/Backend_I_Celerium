import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('data/products.json');

export default class ProductManager {
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

    async getProducts() {
        return this.#readFile();
    }

    async getProductById(id) {
        const products = await this.#readFile();
        return products.find(p => p.id === id);
    }

    async addProduct(productData) {
        const products = await this.#readFile();
        const newProduct = {
            id: crypto.randomUUID(),
            ...productData
        };
        products.push(newProduct);
        await this.#writeFile(products);
        return newProduct;
    }

    async updateProduct(id, updatedFields) {
        const products = await this.#readFile();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return null;

        products[index] = {
            ...products[index],
            ...updatedFields,
            id: products[index].id
        };
        await this.#writeFile(products);
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.#readFile();
        const filtered = products.filter(p => p.id !== id);
        await this.#writeFile(filtered);
    }
}