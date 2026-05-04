import { catchAsync } from "../Utilities/catchAsync.js";
import * as ecommerceServices from "../Services/ecommerce.service.js";

export const createStore = catchAsync(async (req, res) => {
  const store = await ecommerceServices.createStore(req.user, req.body);

  return res.status(201).json({
    success: true,
    message: "Store created successfully",
    store,
  });
});

export const listStores = catchAsync(async (req, res) => {
  const stores = await ecommerceServices.listStores(req.user);

  return res.status(200).json({
    success: true,
    message: "Stores fetched successfully",
    stores,
  });
});

export const getStore = catchAsync(async (req, res) => {
  const store = await ecommerceServices.getStore(req.user, req.params.storeId);

  return res.status(200).json({
    success: true,
    message: "Store fetched successfully",
    store,
  });
});

export const updateStore = catchAsync(async (req, res) => {
  const store = await ecommerceServices.updateStore(req.user, req.params.storeId, req.body);

  return res.status(200).json({
    success: true,
    message: "Store updated successfully",
    store,
  });
});

export const archiveStore = catchAsync(async (req, res) => {
  const store = await ecommerceServices.archiveStore(req.user, req.params.storeId);

  return res.status(200).json({
    success: true,
    message: "Store archived successfully",
    store,
  });
});

export const listProducts = catchAsync(async (req, res) => {
  const products = await ecommerceServices.listProducts(req.user, req.params.storeId);

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    products,
  });
});

export const createProduct = catchAsync(async (req, res) => {
  const product = await ecommerceServices.createProduct(req.user, req.params.storeId, req.body);

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

export const updateProduct = catchAsync(async (req, res) => {
  const product = await ecommerceServices.updateProduct(
    req.user,
    req.params.storeId,
    req.params.productId,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

export const deleteProduct = catchAsync(async (req, res) => {
  const product = await ecommerceServices.deleteProduct(
    req.user,
    req.params.storeId,
    req.params.productId,
  );

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
    product,
  });
});

export const uploadProductImage = catchAsync(async (req, res) => {
  const image = await ecommerceServices.uploadProductImage(req.user, req.params.storeId, req.file);

  return res.status(201).json({
    success: true,
    message: "Product image uploaded successfully",
    image,
  });
});

export const listCustomers = catchAsync(async (req, res) => {
  const customers = await ecommerceServices.listCustomers(req.user, req.params.storeId);

  return res.status(200).json({
    success: true,
    message: "Customers fetched successfully",
    customers,
  });
});

export const listCarts = catchAsync(async (req, res) => {
  const carts = await ecommerceServices.listCarts(req.user, req.params.storeId);

  return res.status(200).json({
    success: true,
    message: "Carts fetched successfully",
    carts,
  });
});

export const listFavouriteLists = catchAsync(async (req, res) => {
  const favourites = await ecommerceServices.listFavouriteLists(req.user, req.params.storeId);

  return res.status(200).json({
    success: true,
    message: "Favourite lists fetched successfully",
    favourites,
  });
});

export const getPublicStorefront = catchAsync(async (req, res) => {
  const storefront = await ecommerceServices.getPublicStorefront(req.params.storeId);

  return res.status(200).json({
    success: true,
    message: "Storefront fetched successfully",
    ...storefront,
  });
});

export const upsertCustomer = catchAsync(async (req, res) => {
  const customer = await ecommerceServices.upsertCustomer(req.params.storeId, req.body);

  return res.status(200).json({
    success: true,
    message: "Customer saved successfully",
    customer,
  });
});

export const getCart = catchAsync(async (req, res) => {
  const cart = await ecommerceServices.getCart(req.params.storeId, req.query);

  return res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    cart,
  });
});

export const addCartItem = catchAsync(async (req, res) => {
  const cart = await ecommerceServices.addCartItem(req.params.storeId, req.body);

  return res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    cart,
  });
});

export const updateCartItem = catchAsync(async (req, res) => {
  const cart = await ecommerceServices.updateCartItem(req.params.storeId, req.body);

  return res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    cart,
  });
});

export const clearCart = catchAsync(async (req, res) => {
  const cart = await ecommerceServices.clearCart(req.params.storeId, req.body);

  return res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    cart,
  });
});

export const getFavourites = catchAsync(async (req, res) => {
  const favourites = await ecommerceServices.getFavourites(req.params.storeId, req.query);

  return res.status(200).json({
    success: true,
    message: "Favourites fetched successfully",
    favourites,
  });
});

export const toggleFavourite = catchAsync(async (req, res) => {
  const favourites = await ecommerceServices.toggleFavourite(req.params.storeId, req.body);

  return res.status(200).json({
    success: true,
    message: "Favourites updated successfully",
    favourites,
  });
});
