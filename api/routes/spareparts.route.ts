import express from "express";
import multer from "multer";
import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { SparePartController } from "../controllers/SparePartController";


export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 50 } })

const router = express.Router()
let controller = new SparePartController()

router.route("/parts")
    .post(isAuthenticatedUser,  upload.single('file'),controller.CreateSparePart)
    .get(isAuthenticatedUser, controller.GetAllSpareParts)
router.get("/dropdown/parts", isAuthenticatedUser, controller.GetSparePartsForDropdown)
router.route("/parts/:id").put(isAuthenticatedUser, upload.single('file'), controller.UpdateSparePart)
router.patch("/parts/machines/edit", isAuthenticatedUser, controller.AssignMachinesToSpareParts)
export default router;