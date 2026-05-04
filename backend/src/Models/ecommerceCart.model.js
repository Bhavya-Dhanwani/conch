import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EcommerceProduct",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    snapshot: {
      name: {
        type: String,
        default: "",
      },
      price: {
        type: Number,
        default: 0,
      },
      imageUrl: {
        type: String,
        default: "",
      },
    },
  },
  { _id: false },
);

const ecommerceCartSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EcommerceStore",
      required: true,
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EcommerceCustomer",
      default: null,
      index: true,
    },
    sessionId: {
      type: String,
      trim: true,
      default: "",
      index: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "converted", "abandoned"],
      default: "active",
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

ecommerceCartSchema.index({ store: 1, customer: 1, status: 1 });
ecommerceCartSchema.index({ store: 1, sessionId: 1, status: 1 });

const EcommerceCarts = mongoose.model("EcommerceCart", ecommerceCartSchema, "ecommerce_carts");

export { EcommerceCarts };
export default EcommerceCarts;
