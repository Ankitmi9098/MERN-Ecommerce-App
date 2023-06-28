import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(200).send({ message: "Name is required." });
    }
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: true,
        message: "Category already exists.",
      });
    }
    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();
    res.status(201).send({
      success: true,
      message: "New Category created.",
      category,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Error in category", error });
  }
};

export const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    if (!name) {
      return res.status(200).send({
        success: false,
        message: "Name is required",
      });
    }
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Category Updated!",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while updating category",
      error,
    });
  }
};

export const categoryController = async (req, res) => {
  try {
    const category = await categoryModel.find();
    res.status(200).send({
      success: true,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching categories",
      error,
    });
  }
};

export const singleCategoryController = async (req, res) => {
  try {
    // const slug = req.params.slug;
    const category = await categoryModel.findOne({ slug: req.params.slug });
    
    res.status(200).send({
      success: true,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while fetching single category",
      error,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findByIdAndDelete(req.params.id);
    res.status(200).send({
      success: true,
      message: "Category Deleted Successfully!",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting category",
      error,
    });
  }
};
