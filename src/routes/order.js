
const { requireSignIn, userMiddleware, adminMiddleware } = require("../common-middleware");
const { addOrder, getOrdersByUser, getAllOrders } = require("../controllers/order");


const router = require("express").Router();

router.post("/user/addOrder", requireSignIn, userMiddleware, addOrder);
router.get("/user/getOrdersByUser/:userId", requireSignIn, userMiddleware, getOrdersByUser);

router.get("/admin/getAllOrders", requireSignIn, adminMiddleware, getAllOrders);


module.exports = router;