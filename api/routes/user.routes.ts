import express from "express";
import multer from "multer";

import { isAuthenticatedUser, isProfileAuthenticated, } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/UserController";
let controller = new UserController()

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 50 } })

const router = express.Router()
router.post("/register", controller.SignUpAsCustomerOrAdmin)
router.post("/sendotp", controller.SendOtp)
router.post("/login", controller.CheckOtpAndLogin)
router.post("/logout", controller.Logout)
router.post("/update-token", isAuthenticatedUser, controller.UpdateFcmToken)
router.route("/profile")
    .get(isProfileAuthenticated, controller.GetProfile)
router.post("/send/email/verifcation-link", isAuthenticatedUser, controller.SendEmailVerificationLink)
router.patch("/email/verify/:token", controller.VerifyEmail)

export default router;