import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer } = req.body;

    //validations
    const missingFields = [];
    if (!name) {
      missingFields.push("Name");
    }
    if (!email) {
      missingFields.push("Email");
    }
    if (!password) {
      missingFields.push("Password");
    }
    if (!phone) {
      missingFields.push("Phone Number");
    }
    if (!address) {
      missingFields.push("Address");
    }
    if (!answer) {
      missingFields.push("Answer");
    }
    if (missingFields.length != 0) {
      const missingFieldsLength = missingFields.length;
      if (missingFieldsLength == 1) {
        return res.send({
          success: false,
          message: missingFields[0] + " is required field.",
        });
      }
      return res.send({
        success: false,
        message:
          missingFields.slice(0, missingFieldsLength - 1).join(", ") +
          ` & ${missingFields[missingFieldsLength - 1]} are required fields.`,
      });
    }

    //check user
    const existingUser = await userModel.findOne({ email });

    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Registered!. Please Login",
      });
    }

    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      address,
      phone,
      password: hashedPassword,
      answer,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error,
    });
  }
};

//Post Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(200).send({
        success: false,
        message: "Invalid Username or Password",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }
    //token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Logged In Successfully",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

//forgotPassword controller
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      res.status(400).send({ message: "Answer is required" });
    }
    if (!newPassword) {
      res.status(400).send({ message: "New Password is required" });
    }
    //check
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(200).send({
        success: false,
        message: "Worng Email or Answer",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Something went wrong", error });
  }
};
//GET test
export const testController = (req, res) => {
  res.send("Protected Route");
};

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, address, password, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    if (password && password.length < 6) {
      return res.status(200).send({
        success: false,
        message: "Password should  at least 7 characters long.",
      });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel
      .findByIdAndUpdate(
        user._id,
        {
          name: name || user.name,
          password: hashedPassword || user.password,
          phone: phone || user.phone,
          address: address || user.address,
          email: email || user.email,
        },
        { new: true }
      )
      .select(["-password", "-answer"]);
    res
      .status(200)
      .send({ success: true, updatedUser, message: "Profile Updated!" });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const statusUpdateController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};
