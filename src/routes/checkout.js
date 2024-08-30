const express=require('express');

const { requireSignIn, userMiddleware } = require('../common-middleware');
const { updateCheckoutAddress, addOrUpdatePaymentMethod, getCheckoutDetails } = require('../controllers/checkout');
const router=express.Router();

router.put('/user/updateCheckoutAddress', requireSignIn , userMiddleware , updateCheckoutAddress)
router.put('/user/addOrUpdatePaymentMethod', requireSignIn , userMiddleware , addOrUpdatePaymentMethod)
router.get('/user/getCheckoutDetails/:userId', requireSignIn , userMiddleware , getCheckoutDetails)



module.exports = router;  