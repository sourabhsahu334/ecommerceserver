const express= require("express");
const {getAllproducts, createProduct, getproduct, updateproduct, deleteproduct, createProductReview}= require( '../controller/productcontroller');
const { isAuthenticatedUser ,authorizeRoles} = require("../midelware/auth");
const router=express.Router();


router.route("/product/:id").get(getproduct).put(updateproduct).delete(deleteproduct);
router.route("/products").get(getAllproducts);
router.route("/createproduct").post(isAuthenticatedUser,authorizeRoles("admin"),createProduct);

router.route("/review").put(isAuthenticatedUser, createProductReview);
// checked



module.exports=router;