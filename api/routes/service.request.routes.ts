import express from "express";
import multer from "multer";

import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { ServiceRequestController } from "../controllers/ServiceRequestController";

let controller = new ServiceRequestController()


export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 50 } })

const router = express.Router()
router.route("/requests")
    .post(isAuthenticatedUser, upload.array('files', 5), controller.CreateServiceRequest)
    .get(isAuthenticatedUser, controller.GetAllServiceRequests)
router.route("/requests/:id")
    .get(isAuthenticatedUser, controller.GetAllServiceRequestsDetailed)
    .post(isAuthenticatedUser, upload.array('files', 5), controller.HandleServiceRequest).put(isAuthenticatedUser, controller.CloseServiceRequest)

export default router;