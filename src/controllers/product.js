const Product = require('../models/product');
const shortid = require("shortid");
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const generatedProductCodes = new Set(); // Define a set to store generated product codes

const generateproductCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let productCode;
  let numberOfNumbers = 0;
  do {
    productCode = 'C-';
    numberOfNumbers = 0;
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      const randomChar = characters[randomIndex];
      // Check if the character is a number
      if (/\d/.test(randomChar)) {
        numberOfNumbers++;
      }
      productCode += randomChar;
    }
  } while (generatedProductCodes.has(productCode) || numberOfNumbers < 3); // Check for uniqueness and at least three numbers
  generatedProductCodes.add(productCode); // Add the generated product code to the set
  return productCode;
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destinationPath = path.join(__dirname, '../ProductsImages');
    // Check if the Categories folder exists, create it if it doesn't
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }
    cb(null, destinationPath);
  },
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + '-' + file.originalname);
  }
});

const upload = multer({ storage }).fields([
  { name: 'productPictures[]', maxCount: 5 }, // Adjust maxCount as needed
  { name: 'productVideo', maxCount: 1 }
]);

exports.createProduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error uploading product files:', err);
        return res.status(500).json({ success: false, message: 'An error occurred while uploading product files.' });
      }

      try {
        const {
          category, name, type, productBy, //description,
          quantity, height, width, length, sizes,
          goldType, goldKt,
          diamondType,
          stoneType,
          diamondprice, goldprice, stoneprice, makingCharges, gst, offer, total,
        } = req.body;
        console.log(category, name, type, productBy, //description,
          quantity, height, width, length, sizes,
          goldType, goldKt,
          diamondType,
          stoneType,
          diamondprice, goldprice, stoneprice, makingCharges, gst, offer, total,
        )
        let productPictures = [];
        let productVideo = null;

        // Corrected file access
        if (req.files) {
          if (req.files['productPictures[]'] && req.files['productPictures[]'].length > 0) {
            productPictures = req.files['productPictures[]'].map(image => ({
              img: `/publicProduct/${image.filename}`
            }));
          }

          if (req.files['productVideo'] && req.files['productVideo'].length > 0) {
            productVideo = `/publicProduct/${req.files['productVideo'][0].filename}`;
          }
        }

        const productCode = generateproductCode();
        const product = new Product({
          category, name, type, productBy, productCode, //description,
          quantity, height, width, length, sizes,
          goldType, goldKt,
          diamondType,
          stoneType,
          diamondprice, goldprice, stoneprice, makingCharges, gst, offer, total, productPictures,
          productVideo,
        });
        console.log(sizes)
        await product.save();

        // Execute code after successfully saving to the database
        // For example, you can log a success message
        console.log('Product saved successfully to the database.');

        return res.status(201).json({ success: true, product, message: 'Product added successfully.' });
      } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ success: false, message: 'Required fields are missing.' });
      }
    });
  } catch (error) {
    console.error('Error uploading product files:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while uploading product files.' });
  }
};

exports.getProductNamesAndId = async (req, res) => {
  try {
    const products = await Product.find().select('name _id');
    return res.status(201).json({ success: true, products })
  } catch (error) {
    console.log("error:", error);
    return res.status(401).json({ success: false, message: error })
  }
};

exports.getProductByCategory = async (req, res) => {
  try {
    const { category } = req.params; // Assuming category is passed as a route parameter

    // Assuming you have a Product model imported
    const products = await Product.find({ category });

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: 'No products found for the specified category.' });
    }

    return res.status(201).json({ success: true, products, message: 'Products retrieved successfully.' });
  } catch (error) {
    console.error('Error retrieving products by category:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while retrieving products.' });
  }
};

exports.getDetailsByProductId = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product details by ID:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while fetching product details.' });
  }
};

exports.getCustamizedByProductId = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId).select('goldType goldKt diamondType size');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(201).json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product details by ID:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while fetching product details.' });
  }
};


exports.editProduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error('Error uploading product files:', err);
        return res.status(500).json({ success: false, message: 'An error occurred while uploading product files.' });
      }

      const productId = req.params.productId; // Assuming productId is passed in the request URL
      const updateFields = { ...req.body };
      delete updateFields.productId; // Remove productId from updateFields

      try {
        const product = await Product.findById(productId);

        if (!product) {
          return res.status(404).json({ success: false, message: 'Product not found.' });
        }

        let productPictures = [];
        let productVideo = null;

        if (req.files) {
          if (req.files['productPictures[]'] && req.files['productPictures[]'].length > 0) {
            productPictures = req.files['productPictures[]'].map(image => ({
              img: `/publicProduct/${image.filename}`
            }));
          }

          if (req.files['productVideo'] && req.files['productVideo'].length > 0) {
            productVideo = `/publicProduct/${req.files['productVideo'][0].filename}`;
          }
        }

        if (productPictures.length > 0) {
          updateFields.productPictures = productPictures;
        }

        if (productVideo) {
          updateFields.productVideo = productVideo;
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, { $set: updateFields }, { new: true });

        return res.status(201).json({ success: true, product: updatedProduct, message: 'Product updated successfully.' });
      } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while updating the product.' });
      }
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while updating the product.' });
  }
};



exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.productId;
    console.log(productId);
    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    // Delete product pictures from the ProductsImages folder
    if (product.productPictures && product.productPictures.length > 0) {
      await Promise.all(product.productPictures.map(async (picture) => {
        const imagePath = path.join(__dirname, '../ProductsImages', path.basename(picture.img));
        if (fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
            console.log("Image deleted successfully.");
          } catch (err) {
            console.error("Error deleting image:", err);
          }
        }
      }));
    }
    // Delete product video from the ProductsVideos folder
    if (product.productVideo) {
      const videoPath = path.join(__dirname, '../ProductsImages', path.basename(product.productVideo));
      console.log("Deleting video file:", videoPath); // Log the deletion of the video file
      if (fs.existsSync(videoPath)) {
        try {
          fs.unlinkSync(videoPath);
          console.log("Video deleted successfully.");
          // Remove the productVideo field from the database
          product.productVideo = null;
          await product.save(); // Save the product without the video field
        } catch (err) {
          console.error("Error deleting video:", err);
          return res.status(500).json({ success: false, message: 'An error occurred while deleting the video.' });
        }
      } else {
        console.log("Video does not exist at path:", videoPath);
        // Handle the case where the video file does not exist
      }
    }
    // Delete the product from the database
    await product.remove();
    return res.status(201).json({ success: true, message: 'Product deleted successfully.' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while deleting the product.' });
  }
};


const _ = require('lodash');
exports.getAllProducts = async (req, res) => {
  try {
    // Define an array to hold products from each category
    const productsByCategory = [];

    // Fetch up to 16 products from each category
    const categories = await Product.distinct('category');
    for (const category of categories) {
      const products = await Product.find({ category }).limit(16);
      productsByCategory.push(products);
    }

    // Combine products from different categories
    let mixedProducts = _.flatten(productsByCategory);

    // Shuffle the array of products randomly
    mixedProducts = _.shuffle(mixedProducts);

    // Limit the final result to 16 products
    mixedProducts = mixedProducts.slice(0, 16);

    return res.status(201).json({ success: true, products: mixedProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while fetching the products.' });
  }
};


exports.getSimilarProducts = async (req, res) => {
  try {
    // Extract category from request parameters
    const { category } = req.params;
    console.log(category)
    // Fetch products based on category
    const products = await Product.find({ category }).exec(); // Ensure execution of the query

    // Check if any products were found
    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: 'No products found for the specified category.' });
    }

    // Shuffle the array of products randomly
    const shuffledProducts = _.shuffle(products);

    // Return only five random products
    const similarProducts = shuffledProducts.slice(0, 5);

    return res.status(201).json({ success: true, similarProducts });
  } catch (error) {
    console.error('Error fetching similar products:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while fetching the similar products.' });
  }
};


// const convertToIndianFormat = (value) => {
//   if (value === "") return value;

//   const number = parseFloat(value);
//   if (isNaN(number)) return value;

//   const formatter = new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//   });

//   return formatter.format(number).replace("₹", ""); // Removing the currency symbol
// };

exports.countOfProducts = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    const categoryCounts = categories.map(category => ({
      category: category._id,
      count: category.count
    }));

    return res.status(201).json({ success: true, categoryCounts });
  } catch (error) {
    console.error('Error counting products:', error);
    return res.status(500).json({ success: false, message: 'An error occurred while counting the products.' });
  }
};
