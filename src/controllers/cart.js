const Cart = require("../models/cart");
const mongoose = require('mongoose');
const Product = require('../models/product');

function runUpdate(condition, updateData) {
  return new Promise((resolve, reject) => {
    //you update code here

    Cart.findOneAndUpdate(condition, updateData, { upsert: true })
      .then((result) => resolve())
      .catch((err) => reject(err));
  });
} 

exports.addItemToCart = async (req, res) => {
  const { cartItem } = req.body;

  console.log(cartItem)
  if (!Array.isArray(cartItem)) {
    return res.status(400).json({ error: 'cartItem should be an array' });
  }

  try {
    const existingCart = await Cart.findOne({ user: req.user._id });

    if (existingCart) {
      // Cart already exists, update or add items
      for (const newCartItem of cartItem) {
        const existingItemIndex = existingCart.cartItems.findIndex(
          item => item.product.toString() === newCartItem.product.toString()
        );

        if (existingItemIndex !== -1) {
          // Item already exists, update its quantity and additional properties
          const existingItem = existingCart.cartItems[existingItemIndex];
          existingItem.quantity += newCartItem.quantity;
          existingItem.sizes = newCartItem.sizes; // Update sizes
          existingItem.goldType = newCartItem.goldType; // Update goldType
          existingItem.goldKt = newCartItem.goldKt; // Update goldKt
          existingItem.diamondType = newCartItem.diamondType; // Update diamondType
          existingItem.stoneType = newCartItem.stoneType; // Update stoneType
        } else {
          // Item is not in the cart, add it
          existingCart.cartItems.push(newCartItem);
        }
      }

      await existingCart.save();
      return res.status(201).json({ message: 'Cart updated successfully', cart: existingCart });
    } else {
      // Cart does not exist, create a new one
      const newCart = new Cart({
        user: req.user._id,
        cartItems: cartItem,
      });
      const savedCart = await newCart.save();
      return res.status(201).json({ message: 'Cart created successfully', cart: savedCart });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};


// exports.addItemToCart = async (req, res) => {
//   const { cartItem } = req.body;
// console.log(cartItem)
//   if (!Array.isArray(cartItem)) {
//     return res.status(400).json({ error: 'cartItem should be an array' });
//   }

//   try {
//     const existingCart = await Cart.findOne({ user: req.user._id });

//     if (existingCart) {
//       // Cart already exists, update or add items
//       for (const newCartItem of cartItem) {
//         const existingItemIndex = existingCart.cartItems.findIndex(
//           item => item.product.toString() === newCartItem.product.toString()
//         );

//         if (existingItemIndex !== -1) {
//           // Item already exists, update its quantity
//           existingCart.cartItems[existingItemIndex].quantity += newCartItem.quantity;
//         } else {
//           // Item is not in the cart, add it
//           existingCart.cartItems.push(newCartItem);
//         }
//       }

//       await existingCart.save();
//       return res.status(201).json({ message: 'Cart updated successfully', cart: existingCart });
//     } else {
//       // Cart does not exist, create a new one
//       const newCart = new Cart({
//         user: req.user._id,
//         cartItems: cartItem,
//       });
//       const savedCart = await newCart.save();
//       return res.status(201).json({ message: 'Cart created successfully', cart: savedCart });
//     }
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };


exports.getCartItems = async (req, res) => {
  try {
    // Find the cart items for the current user
    const cart = await Cart.findOne({ user: req.user._id });

    // If cart not found, return error
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // If cart is empty, return a message with status code 201
    if (cart.cartItems.length === 0) {
      return res.status(201).json({ message: 'No products in your cart' });
    }

    // Extract product IDs from cart items
    const productIds = cart.cartItems.map(item => item.product);

    // Fetch products based on product IDs
    const products = await Product.find({ _id: { $in: productIds } });

    // Combine cart items with product details
    const cartWithProducts = cart.cartItems.map(item => {
      const product = products.find(product => product._id.toString() === item.product.toString());
      return {
        _id: item._id,
        sizes: item.sizes,
        goldType: item.goldType,
        goldKt: item.goldKt,
        diamondType: item.diamondType,
        stoneType: item.stoneType,
        quantity: item.quantity,
        product: product,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };
    });

    res.status(201).json(cartWithProducts); // Respond with status code 200
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: 'Unable to fetch cart items' });
  }
};

exports.removeCartItems = async (req, res) => {
  try {
    const { userId, productId } = req.body;
console.log(userId, productId)
    // Validate if user ID and product ID are provided
    if (!userId || !productId) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    // Find the cart for the specified user
    const cart = await Cart.findOne({ user: userId });

    // If cart not found, return error
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found for the specified user' });
    }

    // Find the index of the cart item with the specified product ID
    const indexToRemove = cart.cartItems.findIndex(item => item.product.toString() === productId);

    // If item not found in the cart, return error
    if (indexToRemove === -1) {
      return res.status(404).json({ error: 'Product not found in the cart' });
    }

    // Remove the item from the cart
    cart.cartItems.splice(indexToRemove, 1);

    // Save the updated cart
    await cart.save();

    return res.status(201).json({ message: 'Product removed from cart successfully', cart: cart });
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return res.status(500).json({ error: 'Unable to remove product from cart' });
  }
};


exports.increaseCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.body;
console.log(userId, productId)
    // Validate if user ID and product ID are provided
    if (!userId || !productId) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    // Find the cart for the specified user
    const cart = await Cart.findOne({ user: userId });

    // If cart not found, return error
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found for the specified user' });
    }

    // Find the index of the cart item with the specified product ID
    const cartItem = cart.cartItems.find(item => item.product.toString() === productId);

    // If item not found in the cart, return error
    if (!cartItem) {
      return res.status(404).json({ error: 'Product not found in the cart' });
    }

    // Increment the quantity of the cart item
    cartItem.quantity += 1;

    // Save the updated cart
    await cart.save();

    return res.status(201).json({ message: 'Quantity increased successfully', cart: cart });
  } catch (error) {
    console.error("Error increasing quantity of product in cart:", error);
    return res.status(500).json({ error: 'Unable to increase quantity of product in cart' });
  }
};

exports.decreaseCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Validate if user ID and product ID are provided
    if (!userId || !productId) {
      return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    // Find the cart for the specified user
    const cart = await Cart.findOne({ user: userId });

    // If cart not found, return error
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found for the specified user' });
    }

    // Find the index of the cart item with the specified product ID
    const cartItemIndex = cart.cartItems.findIndex(item => item.product.toString() === productId);

    // If item not found in the cart, return error
    if (cartItemIndex === -1) {
      return res.status(404).json({ error: 'Product not found in the cart' });
    }

    const cartItem = cart.cartItems[cartItemIndex];

    // If quantity is already 1, return without decrementing or removing the item
    if (cartItem.quantity === 1) {
      return res.status(201).json({ message: 'Quantity is already 1. Cannot decrease further.' });
    }

    // Decrement the quantity of the cart item
    cartItem.quantity -= 1;

    // Save the updated cart
    await cart.save();

    return res.status(201).json({ message: 'Quantity decreased successfully', cart: cart });
  } catch (error) {
    console.error("Error decreasing quantity of product in cart:", error);
    return res.status(500).json({ error: 'Unable to decrease quantity of product in cart' });
  }
};


exports.updateCartItem = async (req, res) => {
  const { cartItems } = req.body;

  if (!Array.isArray(cartItems)) {
    return res.status(400).json({ error: 'cartItems should be an array' });
  }

  try {
    const existingCart = await Cart.findOne({ user: req.user._id });

    if (existingCart) {
      for (const updatedItem of cartItems) {
        const existingItem = existingCart.cartItems.find(
          item => item.product.toString() === updatedItem.product.toString()
        );

        if (existingItem) {
          // Update specified properties of the matched product
          if (updatedItem.goldKt !== undefined) {
            existingItem.goldKt = updatedItem.goldKt;
          }
          if (updatedItem.sizes !== undefined) {
            existingItem.sizes = updatedItem.sizes;
          }
          if (updatedItem.goldType !== undefined) {
            existingItem.goldType = updatedItem.goldType;
          }
          if (updatedItem.diamondType !== undefined) {
            existingItem.diamondType = updatedItem.diamondType;
          }
        }
      }

      await existingCart.save(); // Save the changes outside the loop

      return res.status(201).json({ message: 'Cart updated successfully', cart: existingCart });
    } else {
      return res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

