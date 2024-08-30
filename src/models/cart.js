const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to your user model
    cartItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1 },
            sizes: { type: String,},
            goldType: { type: String, },
            goldKt: { type: String,},
            diamondType: { type: String, },
            stoneType: { type: String, },
        },
    ],
}, { timestamps: true });

// Define a method to remove a cart item by product id
cartSchema.methods.removeCartItem = async function(productId) {
    try {
        // Filter out the item with the specified product id
        this.cartItems = this.cartItems.filter(item => item.product.toString() !== productId.toString());
        await this.save(); // Save the updated cart
        console.log(`Item ${productId} removed from cart successfully`);
    } catch (error) {
        throw new Error(`Error removing item ${productId} from cart: ${error}`);
    }
};

module.exports = mongoose.model('Cart', cartSchema);
