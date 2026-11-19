import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "Category Name is required"],
        trim: true,
    },
    slug: {
        type: String,
        unique: true,
        required: [true, "Category Name is required"],
        trim: true,
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
})


{
    name: "AbCSS "
}

// Pre-save middleware
categorySchema.pre("validate", function () {
    if (this.isModified("name")) {
        this.slug = this.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    }
});



const CategoryModel = mongoose.model("categories", categorySchema);

export default CategoryModel;
