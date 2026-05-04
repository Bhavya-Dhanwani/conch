import mongoose from "mongoose";

const productImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      trim: true,
      default: "",
    },
    alt: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false },
);

const ecommerceProductSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EcommerceStore",
      required: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    compareAtPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    currency: {
      type: String,
      uppercase: true,
      trim: true,
      default: "INR",
    },
    category: {
      type: String,
      trim: true,
      default: "General",
    },
    inventory: {
      type: Number,
      min: 0,
      default: 0,
    },
    images: {
      type: [productImageSchema],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  },
);

ecommerceProductSchema.index({ store: 1, name: 1 });
ecommerceProductSchema.index({ store: 1, category: 1 });

const EcommerceProducts = mongoose.model(
  "EcommerceProduct",
  ecommerceProductSchema,
  "ecommerce_products",
);

export { EcommerceProducts };
export default EcommerceProducts;
