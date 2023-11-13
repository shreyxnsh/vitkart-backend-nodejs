const categoryModel = require('../src/../model/category.model');

// Create a new category
exports.createCategory = async (req, res, next) => {
    try {
        const { categoryName, categoryDesc, categoryImage } = req.body;
        const newCategory = new categoryModel({ categoryName, categoryDesc, categoryImage });
        const createdCategory = await newCategory.save();
        res.json({ status: true, success: createdCategory });
    } catch (error) {
        next(error);
    }
}

// Get all categories
exports.getCategories = async (req, res, next) => {
    try {
        const categoryData = await categoryModel.find();
        res.json({ status: true, success: categoryData });
    } catch (error) {
        next(error);
    }
}

// Get a specific category by ID
exports.getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const categoryData = await categoryModel.findById(id);
        res.json({ status: true, success: categoryData });
    } catch (error) {
        next(error);
    }
}

// Delete a category
exports.deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.body;
        const deletedCategory = await categoryModel.findOneAndDelete({ _id: id });
        res.json({ status: true, success: deletedCategory });
    } catch (error) {
        next(error);
    }
}
