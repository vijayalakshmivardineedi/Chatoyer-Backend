const express=require('express');
const {signup, signin, signout, forgotPassword, verifyCodeAndResetPassword,  deleteProfileImage, getUserByEmail, getAllUsers, addAddress, updateProfile, uploadOrChangeImage}=require("../controllers/auth");
const { validateSignUpRequest, isRequestValidated, validateSignInRequest} = require('../validator/auth');
const router=express.Router();
const { requireSignIn, userMiddleware, adminMiddleware } = require('../common-middleware');


router.post('/user/signup', validateSignUpRequest , isRequestValidated, signup);
router.post('/user/signin', validateSignInRequest, isRequestValidated ,signin);
router.post('/user/signout', signout);
router.post('/user/forgotPassword', forgotPassword);
router.post('/user/verifyCodeAndResetPassword', verifyCodeAndResetPassword);
router.put('/user/updateProfile', requireSignIn, userMiddleware, updateProfile);
router.put('/user/uploadOrChangeImage/:userId', requireSignIn, userMiddleware, uploadOrChangeImage);
router.put('/user/addAddress', requireSignIn, userMiddleware, addAddress);
router.delete('/user/deleteProfileImage/:userId', requireSignIn, userMiddleware, deleteProfileImage);
router.get('/user/getUserByEmail/:email', requireSignIn, userMiddleware, getUserByEmail);


router.get('/admin/getAllUsers', requireSignIn, adminMiddleware, getAllUsers);


module.exports=router;
 