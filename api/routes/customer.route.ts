import express from "express";
import multer from "multer";

import { isAuthenticatedUser } from "../middlewares/auth.middleware";
import { CustomerController } from "../controllers/CustomerController";
let controller = new CustomerController()

export const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 1024 * 1024 * 50 } })

const router = express.Router()
router.route("/customers").get(isAuthenticatedUser, controller.GetAllCustomers).post(isAuthenticatedUser, controller.CreateCustomerFromAdmin)
router.get("/customers/dropdown", isAuthenticatedUser, controller.GetCustomersForDropdown)
router.get("/staff", isAuthenticatedUser, controller.GetAllStaff)
router.post("/staff", isAuthenticatedUser, controller.CreateStaff)
router.route("/customers/:id").put(isAuthenticatedUser, controller.UpdateCustomerFromOwner).get(isAuthenticatedUser, controller.GetSelectedCustomerStaffForAdmin)
router.put("/staff/:id", isAuthenticatedUser, controller.UpdateStaff)
router.get("/staff/dropdown", isAuthenticatedUser, controller.GetStaffsForDropdown)

export default router;