import categoryModel from "../models/category.model.js"
export const create = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
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

        await categoryModel.create({ name });
        res.status(201).json({
            message: "category create successfully",
            status: true
        })


    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        })
    }
}




export const read = () => {
    try {

    } catch (error) {

    }
}

export const readById = () => {
    try {

    } catch (error) {

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