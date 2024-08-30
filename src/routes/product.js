const express=require('express');
const { requireSignIn, adminMiddleware } = require('../common-middleware');
const { createProduct, getAllProducts, getProductByCategory, getDetailsByProductId, deleteProduct, editProduct, getSimilarProducts, getCustamizedByProductId, countOfProducts, getProductNamesAndId, } = require('../controllers/product');
const router=express.Router();

router.post('/admin/createProduct', requireSignIn, adminMiddleware, createProduct);
//router.get('/admin/getAllProducts', requireSignIn, adminMiddleware, getAllProducts);
router.get('/admin/getProductByCategory/:category', requireSignIn, adminMiddleware, getProductByCategory );
router.get('/admin/getDetailsByProductId/:productId', requireSignIn, adminMiddleware, getDetailsByProductId );
router.get('/admin/countOfProducts', requireSignIn, adminMiddleware, countOfProducts );
router.put('/admin/editProduct/:productId', requireSignIn, adminMiddleware, editProduct );
router.delete('/admin/deleteProduct/:productId', requireSignIn, adminMiddleware, deleteProduct );
//user
router.get('/user/getAllProducts', getAllProducts);
router.get('/user/getProductNamesAndId', getProductNamesAndId);
router.get('/user/getSimilarProducts/:category', getSimilarProducts);
router.get('/user/getProductByCategory/:category',  getProductByCategory );
router.get('/user/getDetailsByProductId/:productId', getDetailsByProductId );
router.get('/user/getCustamizedByProductId/:productId', getCustamizedByProductId);

module.exports=router;