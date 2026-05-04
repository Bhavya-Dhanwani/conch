import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import EcommerceStores from "../Models/ecommerceStore.model.js";
import EcommerceProducts from "../Models/ecommerceProduct.model.js";
import EcommerceCustomers from "../Models/ecommerceCustomer.model.js";
import EcommerceCarts from "../Models/ecommerceCart.model.js";
import EcommerceFavourites from "../Models/ecommerceFavourite.model.js";
import { AppError } from "../Utilities/appError.js";

const tidy = (value, fallback = "", maxLength = 240) => {
  if (typeof value !== "string") return fallback;
  return value.trim().slice(0, maxLength) || fallback;
};

const slugify = (value) =>
  tidy(value, "store")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "store";

const requireObjectId = (value, label) => {
  if (!mongoose.isValidObjectId(value)) {
    throw new AppError(`Invalid ${label}`, 400);
  }
};

const getOwnerId = (user) => user?.managerId || user?._id;

const normalizeMoney = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
};

const normalizeImages = (images = []) =>
  Array.isArray(images)
    ? images
        .map((image) => ({
          url: tidy(image?.url, "", 800),
          publicId: tidy(image?.publicId, "", 300),
          alt: tidy(image?.alt, "", 140),
        }))
        .filter((image) => image.url)
        .slice(0, 8)
    : [];

const findOwnedStore = async (user, storeId) => {
  requireObjectId(storeId, "store id");

  const store = await EcommerceStores.findOne({
    _id: storeId,
    owner: getOwnerId(user),
    isActive: true,
  }).lean();

  if (!store) {
    throw new AppError("Store not found", 404);
  }

  return store;
};

const findPublicStore = async (storeIdOrSlug) => {
  const identifier = tidy(storeIdOrSlug, "", 160);
  const query = mongoose.isValidObjectId(identifier)
    ? { _id: identifier }
    : { slug: slugify(identifier) };

  const store = await EcommerceStores.findOne({
    ...query,
    isActive: true,
  }).lean();

  if (!store) {
    throw new AppError("Store not found", 404);
  }

  return store;
};

const getCustomerQuery = ({ customerId, sessionId }) => {
  if (customerId) {
    requireObjectId(customerId, "customer id");
    return { customer: customerId };
  }

  const nextSessionId = tidy(sessionId, "", 160);
  if (!nextSessionId) {
    throw new AppError("customerId or sessionId is required", 400);
  }

  return { sessionId: nextSessionId };
};

const populateCart = (query) =>
  query.populate({
    path: "items.product",
    select: "name price currency images category inventory isActive",
  });

export const createStore = async (user, payload = {}) => {
  const name = tidy(payload.name, "", 90);
  if (!name) {
    throw new AppError("Store name is required", 400);
  }

  const store = await EcommerceStores.create({
    owner: getOwnerId(user),
    name,
    slug: slugify(payload.slug || name),
    description: tidy(payload.description, "", 500),
    logoUrl: tidy(payload.logoUrl, "", 800),
    theme: {
      background: tidy(payload.theme?.background, "#f8fafc", 24),
      accent: tidy(payload.theme?.accent, "#2563eb", 24),
      ink: tidy(payload.theme?.ink, "#111827", 24),
    },
  });

  return store.toObject();
};

export const listStores = async (user) =>
  EcommerceStores.find({
    owner: getOwnerId(user),
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();

export const getStore = async (user, storeId) => findOwnedStore(user, storeId);

export const updateStore = async (user, storeId, payload = {}) => {
  await findOwnedStore(user, storeId);

  const updates = {
    name: tidy(payload.name, "", 90),
    slug: payload.slug ? slugify(payload.slug) : undefined,
    description: typeof payload.description === "string" ? tidy(payload.description, "", 500) : undefined,
    logoUrl: typeof payload.logoUrl === "string" ? tidy(payload.logoUrl, "", 800) : undefined,
    theme: payload.theme,
  };

  Object.keys(updates).forEach((key) => updates[key] === undefined && delete updates[key]);
  if (!updates.name) delete updates.name;

  return EcommerceStores.findByIdAndUpdate(storeId, updates, {
    new: true,
    runValidators: true,
  }).lean();
};

export const archiveStore = async (user, storeId) => {
  await findOwnedStore(user, storeId);

  return EcommerceStores.findByIdAndUpdate(
    storeId,
    { isActive: false },
    { new: true },
  ).lean();
};

export const listProducts = async (user, storeId) => {
  await findOwnedStore(user, storeId);

  return EcommerceProducts.find({
    store: storeId,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();
};

export const createProduct = async (user, storeId, payload = {}) => {
  const store = await findOwnedStore(user, storeId);
  const name = tidy(payload.name, "", 120);

  if (!name) {
    throw new AppError("Product name is required", 400);
  }

  const product = await EcommerceProducts.create({
    store: store._id,
    owner: getOwnerId(user),
    name,
    description: tidy(payload.description, "", 1000),
    price: normalizeMoney(payload.price),
    compareAtPrice: normalizeMoney(payload.compareAtPrice),
    currency: tidy(payload.currency, "INR", 6).toUpperCase(),
    category: tidy(payload.category, "General", 90),
    inventory: Math.max(0, Number.parseInt(payload.inventory, 10) || 0),
    images: normalizeImages(payload.images),
    tags: Array.isArray(payload.tags) ? payload.tags.map((tag) => tidy(tag, "", 40)).filter(Boolean).slice(0, 12) : [],
  });

  return product.toObject();
};

export const updateProduct = async (user, storeId, productId, payload = {}) => {
  await findOwnedStore(user, storeId);
  requireObjectId(productId, "product id");

  const product = await EcommerceProducts.findOne({
    _id: productId,
    store: storeId,
    owner: getOwnerId(user),
    isActive: true,
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const fields = ["name", "description", "currency", "category"];
  fields.forEach((field) => {
    if (typeof payload[field] === "string") product[field] = tidy(payload[field], product[field], field === "description" ? 1000 : 120);
  });

  if (payload.price !== undefined) product.price = normalizeMoney(payload.price, product.price);
  if (payload.compareAtPrice !== undefined) product.compareAtPrice = normalizeMoney(payload.compareAtPrice, product.compareAtPrice);
  if (payload.inventory !== undefined) product.inventory = Math.max(0, Number.parseInt(payload.inventory, 10) || 0);
  if (payload.images !== undefined) product.images = normalizeImages(payload.images);
  if (Array.isArray(payload.tags)) product.tags = payload.tags.map((tag) => tidy(tag, "", 40)).filter(Boolean).slice(0, 12);

  await product.save();
  return product.toObject();
};

export const deleteProduct = async (user, storeId, productId) => {
  await findOwnedStore(user, storeId);
  requireObjectId(productId, "product id");

  const product = await EcommerceProducts.findOneAndUpdate(
    {
      _id: productId,
      store: storeId,
      owner: getOwnerId(user),
      isActive: true,
    },
    { isActive: false },
    { new: true },
  ).lean();

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  return product;
};

const configureCloudinary = () => {
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new AppError(
      "Cloudinary env vars are missing: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET",
      500,
    );
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
};

export const uploadProductImage = async (user, storeId, file) => {
  await findOwnedStore(user, storeId);
  if (!file) throw new AppError("Product image is required", 400);

  configureCloudinary();

  try {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `conch/ecommerce/${storeId}`,
          resource_type: "image",
          transformation: [{ width: 1200, height: 1200, crop: "limit" }],
        },
        (error, uploadResult) => {
          if (error) return reject(error);
          return resolve(uploadResult);
        },
      );

      stream.end(file.buffer);
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    if (error.http_code === 401 || /invalid cloud_name/i.test(error.message || "")) {
      throw new AppError(
        "Cloudinary rejected the upload. Check CLOUDINARY_CLOUD_NAME in backend/.env; it must be your Cloudinary cloud name.",
        500,
      );
    }

    throw new AppError(error.message || "Product image upload failed", 500);
  }
};

export const listCustomers = async (user, storeId) => {
  await findOwnedStore(user, storeId);

  return EcommerceCustomers.find({ store: storeId })
    .sort({ createdAt: -1 })
    .lean();
};

export const listCarts = async (user, storeId) => {
  await findOwnedStore(user, storeId);

  return populateCart(
    EcommerceCarts.find({
      store: storeId,
    }).sort({ updatedAt: -1 }),
  ).lean();
};

export const listFavouriteLists = async (user, storeId) => {
  await findOwnedStore(user, storeId);

  return EcommerceFavourites.find({
    store: storeId,
  })
    .populate({
      path: "products",
      select: "name price currency images category inventory isActive",
    })
    .sort({ updatedAt: -1 })
    .lean();
};

export const getPublicStorefront = async (storeId) => {
  const store = await findPublicStore(storeId);
  const products = await EcommerceProducts.find({
    store: storeId,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  return { store, products };
};

export const upsertCustomer = async (storeId, payload = {}) => {
  await findPublicStore(storeId);

  const email = tidy(payload.email, "", 140).toLowerCase();
  const sessionId = tidy(payload.sessionId, "", 160);
  if (!email && !sessionId) {
    throw new AppError("Customer email or sessionId is required", 400);
  }

  const query = email ? { store: storeId, email } : { store: storeId, sessionId };
  const customer = await EcommerceCustomers.findOneAndUpdate(
    query,
    {
      $set: {
        name: tidy(payload.name, "", 90),
        email,
        phone: tidy(payload.phone, "", 40),
        sessionId,
        address: payload.address || {},
      },
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    },
  ).lean();

  return customer;
};

export const getCart = async (storeId, query = {}) => {
  await findPublicStore(storeId);
  const ownerQuery = getCustomerQuery(query);
  const cart = await populateCart(
    EcommerceCarts.findOne({
      store: storeId,
      status: "active",
      ...ownerQuery,
    }),
  ).lean();

  return cart || { store: storeId, items: [], status: "active" };
};

export const addCartItem = async (storeId, payload = {}) => {
  await findPublicStore(storeId);
  requireObjectId(payload.productId, "product id");

  const product = await EcommerceProducts.findOne({
    _id: payload.productId,
    store: storeId,
    isActive: true,
  }).lean();

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const ownerQuery = getCustomerQuery(payload);
  const quantity = Math.max(1, Number.parseInt(payload.quantity, 10) || 1);
  const cart = await EcommerceCarts.findOneAndUpdate(
    {
      store: storeId,
      status: "active",
      ...ownerQuery,
    },
    {
      $setOnInsert: {
        store: storeId,
        status: "active",
        ...ownerQuery,
      },
    },
    {
      new: true,
      upsert: true,
    },
  );

  const existing = cart.items.find((item) => item.product.toString() === payload.productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({
      product: payload.productId,
      quantity,
      snapshot: {
        name: product.name,
        price: product.price,
        imageUrl: product.images?.[0]?.url || "",
      },
    });
  }

  await cart.save();
  return populateCart(EcommerceCarts.findById(cart._id)).lean();
};

export const updateCartItem = async (storeId, payload = {}) => {
  await findPublicStore(storeId);
  requireObjectId(payload.productId, "product id");

  const ownerQuery = getCustomerQuery(payload);
  const cart = await EcommerceCarts.findOne({
    store: storeId,
    status: "active",
    ...ownerQuery,
  });

  if (!cart) {
    throw new AppError("Cart not found", 404);
  }

  const quantity = Math.max(0, Number.parseInt(payload.quantity, 10) || 0);
  cart.items = quantity
    ? cart.items.map((item) =>
        item.product.toString() === payload.productId ? { ...item.toObject(), quantity } : item,
      )
    : cart.items.filter((item) => item.product.toString() !== payload.productId);

  await cart.save();
  return populateCart(EcommerceCarts.findById(cart._id)).lean();
};

export const clearCart = async (storeId, payload = {}) => {
  await findPublicStore(storeId);
  const ownerQuery = getCustomerQuery(payload);

  const cart = await EcommerceCarts.findOneAndUpdate(
    {
      store: storeId,
      status: "active",
      ...ownerQuery,
    },
    { items: [] },
    { new: true },
  ).lean();

  return cart || { store: storeId, items: [], status: "active" };
};

export const getFavourites = async (storeId, query = {}) => {
  await findPublicStore(storeId);
  const ownerQuery = getCustomerQuery(query);
  const favourites = await EcommerceFavourites.findOne({
    store: storeId,
    ...ownerQuery,
  })
    .populate({
      path: "products",
      select: "name price currency images category inventory isActive",
    })
    .lean();

  return favourites || { store: storeId, products: [] };
};

export const toggleFavourite = async (storeId, payload = {}) => {
  await findPublicStore(storeId);
  requireObjectId(payload.productId, "product id");

  const product = await EcommerceProducts.findOne({
    _id: payload.productId,
    store: storeId,
    isActive: true,
  }).lean();

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const ownerQuery = getCustomerQuery(payload);
  const favourites = await EcommerceFavourites.findOneAndUpdate(
    {
      store: storeId,
      ...ownerQuery,
    },
    {
      $setOnInsert: {
        store: storeId,
        ...ownerQuery,
      },
    },
    { new: true, upsert: true },
  );

  const exists = favourites.products.some((id) => id.toString() === payload.productId);
  favourites.products = exists
    ? favourites.products.filter((id) => id.toString() !== payload.productId)
    : [...favourites.products, payload.productId];

  await favourites.save();
  return getFavourites(storeId, payload);
};
