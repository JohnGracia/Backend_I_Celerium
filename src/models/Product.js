import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    code: { type: String, required: true, unique: true },
    stock: { type: Number, default: 0 },
    category: { type: String, default: 'general' },
    status: { type: Boolean, default: true },
    thumbnails: [String]
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;