import express from "express";
import multer from "multer";

import { isAuthenticatedUser, } from "../middlewares/auth.middleware";
import { EngineerController } from "../controllers/EngineerController";
let controller = new EngineerController()

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 50 } })

const router = express.Router()
router.route("/engineers").get(isAuthenticatedUser, controller.GetAllEngineers).post(isAuthenticatedUser, controller.CreateEngineer)
router.route("/engineers/:id").put(isAuthenticatedUser, controller.UpdateEngineer)
router.get("/engineers/dropdown", isAuthenticatedUser, controller.GetEngineersForDropdown)

export default router;