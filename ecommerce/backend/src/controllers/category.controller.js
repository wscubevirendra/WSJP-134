import categoryModel from "../models/category.model.js"
import uploadImage from "../utils/uploadImage.js";

export const create = async (req, res) => {
    try {
        //1.Get Data From Req Object
        const file = await uploadImage(req, res, "categories");

        console.log(file)
        const { name } = req.body;
        if (!name || !file) {
            return res.status(400).json({
                message: "All field are required",
                success: false
            })
        }

        const category = await categoryModel.findOne({ name: name });
        if (category) {
            return res.status(409).json({
                message: "category already create",
                success: false
            })
        }

        await categoryModel.create({ name, image: file.path });
        res.status(201).json({
            message: "category create successfully",
            status: true
        })


    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        })
    }
}




export const read = async (req, res) => {
    try {
        const categories = await categoryModel.find();
        res.status(200).json({
            message: "Category Data Fetched",
            success: true,
            categories
        })

    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        })
    }
}

export const readById = async(req,res) => {
    try {
        const categoryId = req.params.id
        const category = await categoryModel.findById({ _id: categoryId });
        res.status(200).json({
            message: "Category Data Fetched",
            success: true,
            category
        })


    } catch (error) {
 res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        })
    }
}

export const deleteById = () => {
    try {

    } catch (error) {

    }
}

export const statusUpdate = () => {
    try {

    } catch (error) {

    }
}

export const updateById = () => {
    try {

    } catch (error) {

    }
}