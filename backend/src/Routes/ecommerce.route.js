import express from "express";
import multer from "multer";

import * as controller from "../Controllers/ecommerce.controller.js";
import { isAuthenticated } from "../Middlewares/auth.middleware.js";

const ecommerceRouter = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 6 * 1024 * 1024,
  },
  fileFilter: (req, file, callback) => {
    if (/^image\/(png|jpe?g|webp|svg\+xml)$/.test(file.mimetype)) {
      callback(null, true);
      return;
    }

    callback(new Error("Upload a PNG, JPG, WEBP, or SVG image."));
  },
});

const uploadProductImage = (req, res, next) => {
  upload.single("image")(req, res, (error) => {
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message || "Product image upload failed",
      });
    }

    return next();
  });
};

ecommerceRouter.get("/public/stores/:storeId", controller.getPublicStorefront);
ecommerceRouter.post("/public/stores/:storeId/customers", controller.upsertCustomer);
ecommerceRouter.get("/public/stores/:storeId/cart", controller.getCart);
ecommerceRouter.post("/public/stores/:storeId/cart/items", controller.addCartItem);
ecommerceRouter.patch("/public/stores/:storeId/cart/items", controller.updateCartItem);
ecommerceRouter.delete("/public/stores/:storeId/cart", controller.clearCart);
ecommerceRouter.get("/public/stores/:storeId/favourites", controller.getFavourites);
ecommerceRouter.post("/public/stores/:storeId/favourites/toggle", controller.toggleFavourite);

ecommerceRouter.use(isAuthenticated);

ecommerceRouter.route("/stores").post(controller.createStore).get(controller.listStores);
ecommerceRouter
  .route("/stores/:storeId")
  .get(controller.getStore)
  .patch(controller.updateStore)
  .delete(controller.archiveStore);

ecommerceRouter
  .route("/stores/:storeId/products")
  .get(controller.listProducts)
  .post(controller.createProduct);

ecommerceRouter.post(
  "/stores/:storeId/products/images",
  uploadProductImage,
  controller.uploadProductImage,
);
ecommerceRouter.get("/stores/:storeId/customers", controller.listCustomers);
ecommerceRouter.get("/stores/:storeId/carts", controller.listCarts);
ecommerceRouter.get("/stores/:storeId/favourites", controller.listFavouriteLists);

ecommerceRouter
  .route("/stores/:storeId/products/:productId")
  .patch(controller.updateProduct)
  .delete(controller.deleteProduct);

export default ecommerceRouter;
