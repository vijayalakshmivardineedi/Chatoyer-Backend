const express=require('express');
const { requireSignIn, adminMiddleware } = require('../common-middleware');
const { updateGoldKtPrices, updateDiamondPrices } = require('../controllers/productscal');
const router=express.Router();

router.post('/admin/updateGoldKtPrices', requireSignIn, adminMiddleware, updateGoldKtPrices );
router.post('/admin/updateDiamondPrices', requireSignIn, adminMiddleware, updateDiamondPrices );



module.exports=router;