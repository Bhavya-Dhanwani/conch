import mongoose from "mongoose";

const ecommerceStoreSchema = new mongoose.Schema(
  {
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
      maxlength: 90,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 110,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    logoUrl: {
      type: String,
      trim: true,
      default: "",
    },
    theme: {
      background: {
        type: String,
        default: "#f8fafc",
      },
      accent: {
        type: String,
        default: "#2563eb",
      },
      ink: {
        type: String,
        default: "#111827",
      },
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

ecommerceStoreSchema.index({ owner: 1, slug: 1 }, { unique: true });

const EcommerceStores = mongoose.model("EcommerceStore", ecommerceStoreSchema, "ecommerce_stores");

export { EcommerceStores };
export default EcommerceStores;
