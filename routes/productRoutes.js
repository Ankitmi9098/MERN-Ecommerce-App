import express from "express";
import formidable from "express-formidable";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  braintreePaymentsController,
  braintreeTokenController,
  categoryBasedProductController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCountController,
  productFilterController,
  productListController,
  productPhotoContoller,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";

const router = express.Router();

//routes
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

//get Products
router.get("/get-product", getProductController);

//getSingleProduct
router.get("/get-single-product/:slug", getSingleProductController);

//fetch Photo Route
router.get("/product-photo/:pid", productPhotoContoller);

//delete product route
router.delete(
  "/delete-product/:pid",
  requireSignIn,
  isAdmin,
  deleteProductController
);

//update product
router.put("/update-product/:pid", requireSignIn, isAdmin,formidable(), updateProductController)

//filter product
router.post('/product-filters', productFilterController)

//product count
router.get('/product-count',  productCountController);

//product per page
router.get('/product-list/:page', productListController)

//search product
router.get("/search/:keyword", searchProductController);

//related prodcuts
router.get("/related-product/:pid/:cid", relatedProductController);

//get PRoduct based on category
router.get("/category-product/:slug", categoryBasedProductController)

//PAYMENT ROUTE
router.get("/braintree/token", braintreeTokenController);

router.post("/braintree/payment", requireSignIn, braintreePaymentsController)

export default router;
