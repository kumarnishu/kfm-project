import express from "express";
import multer from "multer";

import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { RegisteredProductController } from "../controllers/RegisteredProductController";


export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 50 } })
let controller = new RegisteredProductController()

const router = express.Router()
router.route("/products")
    .post(isAuthenticatedUser, controller.CreateRegisteredProduct)
    .get(isAuthenticatedUser, controller.GetAllRegisteredProducts)
router.route("/products/:id").put(isAuthenticatedUser, controller.UpdateRegisteredProduct)

export default router;