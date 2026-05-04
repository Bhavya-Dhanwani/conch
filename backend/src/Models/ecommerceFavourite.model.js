import mongoose from "mongoose";

const ecommerceFavouriteSchema = new mongoose.Schema(
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
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EcommerceProduct",
      },
    ],
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

ecommerceFavouriteSchema.index({ store: 1, customer: 1 });
ecommerceFavouriteSchema.index({ store: 1, sessionId: 1 });

const EcommerceFavourites = mongoose.model(
  "EcommerceFavourite",
  ecommerceFavouriteSchema,
  "ecommerce_favourites",
);

export { EcommerceFavourites };
export default EcommerceFavourites;
