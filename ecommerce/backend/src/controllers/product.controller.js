
import ProductModel from "../models/product.model.js";
import uploadImage from "../utils/uploadImage.js";

// CREATE PRODUCT
export const create = async (req, res) => {
    try {
        const file = await uploadImage(req, res, "products");
        const {
            name,
            sku,
            description,
            category,
            price,
            discountPrice,
            color,
            sizes,
            stock,
            status,
            isFeatured,
            isNewArrival,
            isBestSeller,
            isSale
        } = req.body;

        // Required field validation
        if (
            !name ||
            !sku ||
            !description ||
            !category ||
            price === undefined ||
            !color ||
            !file
        ) {
            return res.status(400).json({
                message: "Please provide all required fields",
                success: false
            });
        }

        // Check duplicate product name or SKU
        const existingProduct = await ProductModel.findOne({
            $or: [
                { name },
                { sku }
            ]
        });

        if (existingProduct) {
            return res.status(409).json({
                message: "Product name or SKU already exists",
                success: false
            });
        }

        // Create product
        const product = await ProductModel.create({
            name,
            sku,
            description,
            category,
            price,
            discountPrice,
            thumbnail: file.path,
            color,
            sizes: JSON.parse(sizes),
            stock,
            status,
            isFeatured,
            isNewArrival,
            isBestSeller,
            isSale
        });

        return res.status(201).json({
            message: "Product created successfully",
            success: true,
            product
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
};


// READ ALL PRODUCTS
export const read = async (req, res) => {
    try {
        const products = await ProductModel.find().populate("category", "name slug");
        return res.status(200).json({
            message: "Product data fetched successfully",
            success: true,
            total: products.length,
            products
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
};


// READ PRODUCT BY ID
export const readById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await ProductModel.findById(id)
            .populate("category");

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Product data fetched successfully",
            success: true,
            product
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
};


// UPDATE PRODUCT STATUS
export const statusUpdate = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        product.status = !product.status;
        await product.save();

        return res.status(200).json({
            message: "Product status updated successfully",
            success: true,
            status: product.status
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
};

export const fieldUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { field } = req.body;
        //stock  ,isSale

        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        field = !product[field];
        //stock=true
        await product.save();

        return res.status(200).json({
            message: `Product ${field} updated successfully`,
            success: true,
            status: product.status
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
};

// DELETE PRODUCT
export const deleteById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await ProductModel.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
};


// UPDATE PRODUCT
export const updateById = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            sku,
            description,
            category,
            price,
            discountPrice,
            color,
            sizes,
            stock,
            status,
            isFeatured,
            isNewArrival,
            isBestSeller,
            isSale
        } = req.body;

        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            });
        }

        // Build update object
        const body = {};

        if (name !== undefined) body.name = name;
        if (sku !== undefined) body.sku = sku;
        if (description !== undefined) body.description = description;
        if (category !== undefined) body.category = category;
        if (price !== undefined) body.price = price;
        if (discountPrice !== undefined) body.discountPrice = discountPrice;
        if (color !== undefined) body.color = color;
        if (sizes !== undefined) {
            body.sizes = Array.isArray(sizes)
                ? sizes
                : JSON.parse(sizes);
        }

        if (stock !== undefined) body.stock = stock;
        if (status !== undefined) body.status = status;
        if (isFeatured !== undefined) body.isFeatured = isFeatured;
        if (isNewArrival !== undefined) body.isNewArrival = isNewArrival;
        if (isBestSeller !== undefined) body.isBestSeller = isBestSeller;
        if (isSale !== undefined) body.isSale = isSale;

        // Upload new thumbnail if provided
        const file = await uploadImage(req, res, "products");

        if (file) {
            body.thumbnail = file.path;
        }

        const updatedProduct = await ProductModel.findByIdAndUpdate(
            id,
            { $set: body },
            {
                new: true,
                runValidators: true
            }
        ).populate("category");

        return res.status(200).json({
            message: "Product updated successfully",
            success: true,
            product: updatedProduct
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            success: false
        });
    }
};
