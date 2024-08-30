const product = require("../models/product");
const Wishlist = require("../models/wishlist");


// exports.addItemToWishlist = async (req, res) => {
//   const { wishlistItem } = req.body;

//   if (!Array.isArray(wishlistItem)) {
//     return res.status(400).json({ error: 'wishlistItem should be an array' });
//   }

//   try {
//     const existingWishlist = await Wishlist.findOne({ user: req.user._id });

//     if (existingWishlist) {
//       // Wishlist already exists, update or add items
//       for (const newWishlistItem of wishlistItem) {
//         const existingItemIndex = existingWishlist.wishlistItems.findIndex(
//           item => item.product.toString() === newWishlistItem.product.toString()
//         );

//         if (existingItemIndex !== -1) {
//           // Item already exists, return a message indicating that the item is already in the wishlist
//           return res.status(400).json({ error: 'Item is already in the wishlist' });
//         } else {
//           // Item is not in the wishlist, add it
//           existingWishlist.wishlistItems.push(newWishlistItem);
//         }
//       }

//       await existingWishlist.save();
//       return res.status(201).json({ message: 'Wishlist updated successfully', wishlist: existingWishlist });
//     } else {
//       // Wishlist does not exist, create a new one
//       const newWishlist = new Wishlist({
//         user: req.user._id,
//         wishlistItems: wishlistItem,
//       });
//       const savedWishlist = await newWishlist.save();
//       return res.status(201).json({ message: 'Wishlist created successfully', wishlist: savedWishlist });
//     }
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

exports.addItemToWishlist = async (req, res) => {
  const { wishlistItem } = req.body;

  if (!Array.isArray(wishlistItem)) {
    return res.status(400).json({ error: 'wishlistItem should be an array' });
  }

  try {
    const existingWishlist = await Wishlist.findOne({ user: req.user._id });

    if (existingWishlist) {
      // Wishlist already exists, update or add items
      for (const newWishlistItem of wishlistItem) {
        const existingItemIndex = existingWishlist.wishlistItems.findIndex(
          item => item.product.toString() === newWishlistItem.product.toString()
        );

        if (existingItemIndex !== -1) {
          // Item already exists, update its additional properties
          const existingItem = existingWishlist.wishlistItems[existingItemIndex];
          existingItem.sizes = newWishlistItem.sizes; // Update sizes
          existingItem.goldType = newWishlistItem.goldType; // Update goldType
          existingItem.goldKt = newWishlistItem.goldKt; // Update goldKt
          existingItem.diamondType = newWishlistItem.diamondType; // Update diamondType
          existingItem.stoneType = newWishlistItem.stoneType; // Update stoneType
        } else {
          // Item is not in the wishlist, add it
          existingWishlist.wishlistItems.push(newWishlistItem);
        }
      }

      await existingWishlist.save();
      return res.status(201).json({ message: 'Wishlist updated successfully', wishlist: existingWishlist });
    } else {
      // Wishlist does not exist, create a new one
      const newWishlist = new Wishlist({
        user: req.user._id,
        wishlistItems: wishlistItem,
      });
      const savedWishlist = await newWishlist.save();
      return res.status(201).json({ message: 'Wishlist created successfully', wishlist: savedWishlist });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.getWishlistForDCP = async (req, res) => {
  try {
    // Find the wishlist for the current user
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    // If wishlist doesn't exist, return an empty array
    if (!wishlist) {
      return res.status(200).json([]);
    }

    // If wishlist exists, return the wishlist items
    return res.status(201).json(wishlist.wishlistItems);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.getWishlistItems = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    // Extract product IDs from wishlistItems
    const productIds = wishlist.wishlistItems.map(item => item.product);

    // Fetch products based on product IDs
    const products = await product.find({ _id: { $in: productIds } });

    // Combine wishlist items with product details
    const wishlistWithProducts = wishlist.wishlistItems.map(item => {
      const product = products.find(product => product._id.toString() === item.product.toString());
      return {
        _id: item._id,
        sizes: item.sizes,
        goldType: item.goldType,
        goldKt: item.goldKt,
        diamondType: item.diamondType,
        stoneType: item.stoneType,
        product: product,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      };
    });

    res.json(wishlistWithProducts);
  } catch (error) {
    console.error("Error fetching wishlist items:", error);
    res.status(500).json({ error: 'Unable to fetch wishlist items' });
  }
};

// new update remove wishlist items
exports.removeWishlistItems = (req, res) => {
  const { productId } = req.body;
  console.log(productId)
  if (!productId) {
    return res.status(400).json({ error: 'productId is missing in the request body' });
  }

  // Remove the product from the wishlist based on productId
  Wishlist.updateOne(
    { user: req.user._id },
    {
      $pull: {
        wishlistItems: {
          product: productId,
        },
      },
    }
  )
    .exec()
    .then((result) => {
      if (result) {
        res.status(201).json({ message: "Successfully Removed", result });
      } else {
        res.status(400).json({ error: 'Error removing item from wishlist' });
      }
    })
    .catch((error) => {
      console.error("Error removing item from wishlist:", error);
      res.status(500).json({ error: 'Internal server error' });
    });
};
