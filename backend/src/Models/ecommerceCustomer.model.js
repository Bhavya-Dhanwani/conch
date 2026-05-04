import mongoose from "mongoose";

const ecommerceCustomerSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EcommerceStore",
      required: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 90,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 140,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 40,
      default: "",
    },
    address: {
      line1: {
        type: String,
        trim: true,
        default: "",
      },
      city: {
        type: String,
        trim: true,
        default: "",
      },
      state: {
        type: String,
        trim: true,
        default: "",
      },
      postalCode: {
        type: String,
        trim: true,
        default: "",
      },
      country: {
        type: String,
        trim: true,
        default: "IN",
      },
    },
    sessionId: {
      type: String,
      trim: true,
      default: "",
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

ecommerceCustomerSchema.index(
  { store: 1, email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: { $type: "string", $gt: "" },
    },
  },
);

const EcommerceCustomers = mongoose.model(
  "EcommerceCustomer",
  ecommerceCustomerSchema,
  "ecommerce_customers",
);

export { EcommerceCustomers };
export default EcommerceCustomers;
