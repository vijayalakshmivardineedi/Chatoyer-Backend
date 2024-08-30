const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      name: String,
      contactNumber: String,
      plotNo: String,
      streetName: String,
      district: String,
      state: String,
      country: String,
      pincode: String
    },
    totalAmount: {
      type: String,
      required: true,
    },
    
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {type: Number},
        sizes: {type: String},
        sizePrice: {type: String},
        goldType: {type: String},
        goldTypePrice: {type: String},
        goldKt: {type: String},
        goldKtPrice: {type: String},
        diamondType: {type: String},
        diamondTypePrice: {type: String},
        stoneType: {type: String},
        stonePrice: {type: String},
        makingCharges: {type: String},
        gst: {type: String},
        offer: {type: String}   
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "cancelled", "refund"],
      default: "pending",
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    orderStatus: [
      {
        type: {
          type: String,
          enum: ["ordered", "packed", "shipped", "delivered"],
          
        },
        date: {
          type: Date,
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
    invoice : {
      type: String 
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);