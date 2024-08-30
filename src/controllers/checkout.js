const Checkout = require('../models/checkout');


exports.updateCheckoutAddress = async (req, res) => {
  try {
    const { userId, newAddress } = req.body;

    let checkout = await Checkout.findOne({ user: userId });

    if (!checkout) {
      checkout = new Checkout({
        user: userId,
        address: newAddress
      });
    } else {
      checkout.address = newAddress;
    }

    await checkout.save();

    res.status(201).json({ message: 'Address updated successfully' });
  } catch (error) {
    console.error('Error updating checkout address:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.addOrUpdatePaymentMethod = async (req, res) => {
  try {
    // Check if req.body is undefined
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing or empty' });
    }

    const { userId, paymentMethod, paymentStatus } = req.body;

    // Check if userId or paymentMethod is undefined
    if (!userId || !paymentMethod || !paymentStatus) {
      return res.status(400).json({ error: 'UserId, paymentMethod, or paymentStatus is missing' });
    }

    let checkout = await Checkout.findOne({ user: userId });

    if (!checkout) {
      checkout = new Checkout({
        user: userId,
        paymentMethod: paymentMethod,
        paymentStatus: paymentStatus
      });
    } else {
      checkout.paymentMethod = paymentMethod;
      checkout.paymentStatus = paymentStatus; // Update payment status as well
    }

    await checkout.save();

    res.status(201).json({ message: 'Payment updated successfully' });
  } catch (error) {
    console.error('Error adding/updating payment method:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getCheckoutDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is missing' });
    }

    const checkout = await Checkout.findOne({ user: userId });

    if (!checkout) {
      return res.status(404).json({ message: 'Checkout details not found for the user' });
    }

    res.status(201).json({ checkout });
  } catch (error) {
    console.error('Error fetching checkout details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
