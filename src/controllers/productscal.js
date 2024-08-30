const Product = require('../models/product')


exports.updateGoldKtPrices = async (req, res) => {
  try {
      // Extract gold prices from the request body
      const { "14kt": price14kt, "18kt": price18kt, "22kt": price22kt, "24kt": price24kt } = req.body;

      // Find all products in the database
      const products = await Product.find();

      // Iterate through each product
      for (const product of products) {
          // Iterate through each goldKt value in the product
          for (const goldKt of product.goldKt) {
              // Update the price for each type of gold based on the provided prices
              switch (goldKt.goldKt) {
                  case "14 Kt":
                      if (price14kt) {
                          goldKt.price = (price14kt * parseFloat(goldKt.goldWeight)).toFixed(2);
                      }
                      break;
                  case "18 Kt":
                      if (price18kt) {
                          goldKt.price = (price18kt * parseFloat(goldKt.goldWeight)).toFixed(2);
                      }
                      break;
                  case "22 Kt":
                      if (price22kt) {
                          goldKt.price = (price22kt * parseFloat(goldKt.goldWeight)).toFixed(2);
                      }
                      break;
                  case "24 Kt":
                      if (price24kt) {
                          goldKt.price = (price24kt * parseFloat(goldKt.goldWeight)).toFixed(2);
                      }
                      break;
                  default:
                      // Do nothing if gold type does not match any of the provided types
                      break;
              }
          }

          // Save the updated product to the database
          await product.save();
      }

      // Log and send response
      console.log('Gold prices updated successfully:', req.body);
      return res.status(201).json({ success: true, message: 'Gold prices updated successfully.', prices: req.body });
  } catch (error) {
      console.error('Error updating gold prices:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while updating gold prices.', error });
  }
};


//   exports.updateDiamondPrices = async (req, res) => {
//     try {
//         // Extract diamond prices per carat from the request body
//         const { "SI IJ": pricePerCaratSI_IJ, "SI GH": pricePerCaratSI_GH, "VS GH": pricePerCaratVS_GH, "VVS EF": pricePerCaratVVS_EF } = req.body;
//         console.log({
//           "SI IJ": pricePerCaratSI_IJ,
//           "SI GH": pricePerCaratSI_GH,
//           "VS GH": pricePerCaratVS_GH,
//           "VVS EF": pricePerCaratVVS_EF
//         });
        
//         // Find all products in the database
//         const products = await Product.find();

//         // Iterate through each product
//         for (const product of products) {
//             // Iterate through each diamondType value in the product
//             for (const diamondType of product.diamondType) {
//                 // Extract numeric value from diamond weight string
//                 const diamondWeight = parseFloat(diamondType.diamondWeight.split(' ')[0]); // Assuming the format is "<weight> Ct"

//                 // Initialize price as the existing price
//                 let price = diamondType.price || 0;

//                 // Update the price for each type of diamond based on the provided price per carat, if provided
//                 switch (diamondType.type) {
//                     case "SI IJ":
//                         if (pricePerCaratSI_IJ !== undefined) {
//                             price = pricePerCaratSI_IJ * diamondWeight;
//                         }
//                         break;
//                     case "SI GH":
//                         if (pricePerCaratSI_GH !== undefined) {
//                             price = pricePerCaratSI_GH * diamondWeight;
//                         }
//                         break;
//                     case "VS GH":
//                         if (pricePerCaratVS_GH !== undefined) {
//                             price = pricePerCaratVS_GH * diamondWeight;
//                         }
//                         break;
//                     case "VVS EF":
//                         if (pricePerCaratVVS_EF !== undefined) {
//                             price = pricePerCaratVVS_EF * diamondWeight;
//                         }
//                         break;
//                     default:
//                         // Do nothing if diamond type does not match any of the provided types
//                         break;
//                 }

//                 // Assign the calculated price to the diamondType
//                 diamondType.price = price;
//             }

//             // Save the updated product to the database
//             await product.save();
//         }

//         // Log and send response
//         console.log('Diamond prices updated successfully:', req.body); 
//         return res.status(201).json({ success: true, message: 'Diamond prices updated successfully.', prices: req.body });
//     } catch (error) {
//         console.error('Error updating diamond prices:', error);
//         return res.status(500).json({ success: false, message: 'An error occurred while updating diamond prices.', error });
//     }
// };

exports.updateDiamondPrices = async (req, res) => {
  try {
      // Extract diamond prices per carat from the request body
      const { "SI IJ": pricePerCaratSI_IJ, "SI GH": pricePerCaratSI_GH, "VS GH": pricePerCaratVS_GH, "VVS EF": pricePerCaratVVS_EF } = req.body;

      // Find all products in the database
      const products = await Product.find();

      // Iterate through each product
      for (const product of products) {
          // Iterate through each diamondType value in the product
          for (const diamondType of product.diamondType) {
              // Extract numeric value from diamond weight string
              const diamondWeight = parseFloat(diamondType.diamondWeight.split(' ')[0]); // Assuming the format is "<weight> Ct"

              // Initialize price as the existing price
              let price = diamondType.price || 0;

              // Update the price for each type of diamond based on the provided price per carat, if provided and not empty
              switch (diamondType.type) {
                  case "SI IJ":
                      if (pricePerCaratSI_IJ !== undefined && pricePerCaratSI_IJ !== '') {
                          price = (pricePerCaratSI_IJ * diamondWeight).toFixed(2);
                      }
                      break;
                  case "SI GH":
                      if (pricePerCaratSI_GH !== undefined && pricePerCaratSI_GH !== '') {
                          price = (pricePerCaratSI_GH * diamondWeight).toFixed(2);
                      }
                      break;
                  case "VS GH":
                      if (pricePerCaratVS_GH !== undefined && pricePerCaratVS_GH !== '') {
                          price = (pricePerCaratVS_GH * diamondWeight).toFixed(2);
                      }
                      break;
                  case "VVS EF":
                      if (pricePerCaratVVS_EF !== undefined && pricePerCaratVVS_EF !== '') {
                          price = (pricePerCaratVVS_EF * diamondWeight).toFixed(2);
                      }
                      break;
                  default:
                      // Do nothing if diamond type does not match any of the provided types
                      break;
              }

              // Assign the calculated price to the diamondType
              diamondType.price = price;
          }

          // Save the updated product to the database
          await product.save();
      }

      // Log and send response
      console.log('Diamond prices updated successfully:', req.body); 
      return res.status(201).json({ success: true, message: 'Diamond prices updated successfully.', prices: req.body });
  } catch (error) {
      console.error('Error updating diamond prices:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while updating diamond prices.', error });
  }
};
