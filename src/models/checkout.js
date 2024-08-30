const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema(
  {
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }, 
    address: {
        contactNumber: String,
        plotNo: String,
        streetName: String,
        district: String,
        state: String,
        country: String,
        pincode: String,
        name:String
      },
      paymentMethod: {
        type: String,
      },
      paymentStatus:{
        type: String,
      }
    
  }, { timestamps: true }
);

module.exports = mongoose.model("Checkout", checkoutSchema);
