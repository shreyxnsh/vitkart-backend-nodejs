const categoryModel = require('../model/category.model');


class CategoryService{
    // function to store data in the db
    static async createCategory(categoryName, categoryDesc, categoryImage){
        //create object of the todoModel
        const createCategory = new categoryModel({categoryName, categoryDesc, categoryImage});
        return await createCategory.save();
    }

    // function to get users todo task
    static async getCategories(){
        //create object of todomodel which will fetch data by userid
        // mongoose query to fetch
        const categoryData = await categoryModel.find();
        return categoryData;
    }

    // function to get specific category details by ID
static async getCategoryById(_id){
    // mongoose query to fetch category details by ID
    const categoryData = await categoryModel.findById({_id: _id});
    return categoryData;
}

     // function to delete a users todo
     static async deleteCategory(_id){
        //create object of todomodel which will fetch data by userid
        // mongoose query to fetch
        const categoryDeleted = await categoryModel.findOneAndDelete({_id: _id});
        return categoryDeleted;
    }

}

module.exports = CategoryService;