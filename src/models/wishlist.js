const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to your user model
   wishlistItems: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            sizes: { type: String,},
            goldType: { type: String,},
            goldKt: { type: String,},
            diamondType: { type: String,},
            stoneType: { type: String,},
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);


