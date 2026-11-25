import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: 100,
            unique: true

        },

        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },

        sku: {
            type: String,
            unique: true,
            trim: true,
            uppercase: true,
        },

        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
        },

        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "categories",
            required: [true, "Product category is required"],
        },

        // Pricing
        price: {
            type: Number,
            required: true,
            min: 0,
        },

        discountPrice: {
            type: Number,
            default: null,
            min: 0,
        },

        // Product Media
        images: {
            type: [String],
            default: [],
        },
        thumbnail: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },

        sizes: {
            type: [String],
            default: [],
        },

        // Inventory
        stock: {
            type: Boolean,
            default: true,
        },

        // Product Status
        status: {
            type: Boolean,
            default: true,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        isNewArrival: {
            type: Boolean,
            default: false,
        },

        isBestSeller: {
            type: Boolean,
            default: false,
        },
        isSale: {
            type: Boolean,
            default: false,
        }
    },
    {
        timestamps: true,
    }
);

// Generate slug automatically
productSchema.pre("validate", function () {
    if (this.isModified("name") && this.name) {
        this.slug = slugify(this.name, {
            lower: true,
            strict: true,
        });
    }

});

const ProductModel = mongoose.model("Products", productSchema);

export default ProductModel;
