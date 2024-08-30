const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true

    },
    name: {
        type: String,
        required: true,
        trim: true

    },
    type: {
        type: String,
        required: false,
    },
    productCode: {
        type: String,
        required: true
    },
    productBy: {
        type: String,
        required: false,
        default: "Chatoyer",
    },
    quantity: {
        type: Number,
        required: true
    },
    height: {
        type: String,

    },
    width: {
        type: String,
        required: false
    },
    length: {
        type: String,
        required: false
    },
    sizes: [{
        size: {
            type: String,
            required: false
        },
        price: {
            type: Number,
            required: false
        },
        quantity: {
            type: Number,
            required: false
        },
    }],

    totalProductWeight: {
        type: String,
        required: false
    },
    goldType: [{
        goldtype: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
    }],
    goldKt: [{
        goldKt: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        goldWeight: {
            type: String,
            required: false
        },
    }],
    diamondType: [{
        type: {
            type: String,
            required: false
        },
        price: {
            type: Number,
            required: false
        },
        diamondShape: {
            type: String,
            required: false
        },
        diamondColour: {
            type: String,
            required: false
        },
        diamondCount: {
            type: String,
            required: false
        },
        diamondWeight: {
            type: String,
            required: false
        },
        diamondClarity: {
            type: String,
            required: false
        },
        diamondSettingType: {
            type: String,
            required: false
        },
    }],
    
    stoneType: [{
        stone: {
            type: String,
            required: false
        },
        price: {
            type: Number,
            required: false
        },
        stoneSize: {
            type: String,
            required: false
        },
        stoneShape: {
            type: String,
            required: false
        },
        stonesCount: {
            type: String,
            required: false
        },
        stoneColour: {
            type: String,
            required: false
        },
        stoneWeight: {
            type: String,
            required: false
        },
        stoneSettingtype: {
            type: String,
            required: false
        },
    }],
    makingCharges: {
        type: String,
        required: true
    },
    gst: {
        type: String,
        required: true
    },
    offer: {
        type: String
    },
    productPictures: [
        { img: { type: String } }
    ],
    productVideo: {
        type: String
    },

    // reviews: [
    //     {
    //         userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //         review: String
    //     }
    // ],

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);