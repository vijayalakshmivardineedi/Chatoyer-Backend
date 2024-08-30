const Order = require("../models/order");
const Cart = require("../models/cart");


exports.addOrder = async (req, res) => {
  try {
    const {
      user,
      address,
      totalAmount,
      items,
      paymentStatus,
      paymentMethod,
      orderStatus
    } = req.body;

    // Save the order
    const newOrder = new Order({
      user,
      address,
      totalAmount,
      items,
      paymentStatus,
      paymentMethod,
      orderStatus
    });

    console.log("New Order:", newOrder); // Log the new order object

    const savedOrder = await newOrder.save();

    console.log("Saved Order:", savedOrder); // Log the saved order object

    // Remove all items from the cart of the user
    const cart = await Cart.findOne({ user: user });
    if (cart) {
      await Promise.all(items.map(async (item) => {
        try {
          await cart.removeCartItem(item.productId); // Remove each item from the cart
          console.log(`Item ${item.productId} removed from cart successfully`);
        } catch (error) {
          console.error(`Error removing item ${item.productId} from cart: ${error}`);
        }
      }));
    } else {
      console.log("Cart not found for user:", user);
    }

    res.status(201).json(savedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add order" });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params; 
    const orders = await Order.find({ user: userId }).populate('items.productId');
    res.status(201).json(orders); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve orders by user" });
  }
};



exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.productId');
    res.status(201).json({success:true, orders, orders});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve all orders" });
  }
};

