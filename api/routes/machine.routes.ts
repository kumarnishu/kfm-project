import express from "express";
import multer from "multer";

import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { MachineController } from "../controllers/MachineController";


export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 50 } })
const controller = new MachineController()


const router = express.Router()
router.route("/machines")
    .get(isAuthenticatedUser, controller.GetAllMachines)
    .post(isAuthenticatedUser, upload.single('file'), controller.CreateMachine)
router.get("/dropdown/machines", isAuthenticatedUser, controller.GetMachinesForDropdown)
router.route("/machines/:id").put(isAuthenticatedUser, upload.single('file'), controller.UpdateMachine)
export default router;