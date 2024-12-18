const Category = require('../../models/category')
const Product = require('../../models/product')

const createCategories = (categories, parentId = null) => {


    const categoryList = [];
    let category;
    if (parentId == null) {
        category = categories.filter(cat => cat.parentId == undefined);
    } else {
        category = categories.filter(cat => cat.parentId == parentId)
    }
    for (let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId:cate.parentId,
            children: createCategories(categories, cate._id)
        });
    }
    return categoryList;
};


exports.initialData = async (req, res) => {
    const categories = await Category.find({}).exec();

    const products = await Product.find({})
        .select("_id name description height width type weight gold makingCharges quantity gst total productPictures category")
        //.populate({path:'category',select:"_id, name"})
        .exec();

    res.status(201).json({
        categories:createCategories(categories),
        products
    })
}