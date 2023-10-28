const CategoryService = require('../services/category.services');

// createTodo function to create a todo item for the user and sending to db
// req comes from the frontend to the api
// res is what is sent back to the frontend from the api
exports.createCategory = async (req, res, next)=>{
    try {
       // initializing parameters in the request body 
       const {categoryName, categoryDesc, categoryImage} = req.body;
       // send these 3 data to services
       let category = await CategoryService.createCategory(categoryName, categoryDesc, categoryImage);
       res.json({status:true, success: category}); 

    } catch (error) {
        next(error);
    }
}

// function to get all todo tasks of a particular user
exports.getCategories = async (req, res, next) => {
    try {
       // Extract the userId from the query parameters
       
       // data will be fetched and stored in this todo
       let category = await CategoryService.getCategories();
       res.json({ status: true, success: category });

    } catch (error) {
        next(error);
    }
}

// function to get specific category details by ID
exports.getCategoryById = async (req, res, next) => {
    try {
       // Extract the category ID from the query parameters
       const {id} = req.query;
       
       // data will be fetched and stored in this todo
       let category = await CategoryService.getCategoryById(id);
       res.json({ status: true, success: category });

    } catch (error) {
        next(error);
    }
}

// function to delete todo task of a user
exports.deleteCategory = async (req, res, next) => {
    try {
       // Extract the userId from the query parameters
       const {id} = req.body;
       
       // data will be fetched and stored in this todo
       let deleted = await CategoryService.deleteCategory(id);
       res.json({ status: true, success: deleted });

    } catch (error) {
        next(error);
    }
}

