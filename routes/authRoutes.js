import express from "express";
import {
  registerController,
  loginController,
  testController,
  forgotPasswordController,
  updateProfileController,
  getOrdersController,
  getAllOrdersController,
  statusUpdateController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

//router object
const router = express.Router();

//routing
//Register
router.post("/register", registerController);

//login
router.post("/login", loginController);

//forgot password
router.post("/forgot-password", forgotPasswordController);

//test route
router.get("/test", requireSignIn, isAdmin, testController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//protect admin routes
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//update profile
router.put("/update-profile", requireSignIn, updateProfileController)

router.get("/orders", requireSignIn, getOrdersController)

router.get("/all-orders", requireSignIn, getAllOrdersController)

//status update
router.put("/status-update/:orderId", requireSignIn, statusUpdateController)
export default router;
