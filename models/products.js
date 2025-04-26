import mongoose from "mongoose"

const { Schema } = mongoose

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Boolean,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    imageSrc: {
      type: String,
      required: true,
    },
    imageAlt: {
      type: String,
      required: true,
    },
    categories: {
      type: JSON,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("Product", productSchema)
