import mongoose from 'mongoose';

const cartProductSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, default: 1 }
}, { _id: false });

const cartSchema = new mongoose.Schema({
    products: { type: [cartProductSchema], default: [] }
}, { timestamps: true });

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;