import { NextFunction, Request, Response } from "express"
import { GetAdminDashboardDto, GetEngineerDashboardDto, GetOwnerDashboardDto, GetSparesManagerDashboardDto, GetStaffDashboardDto } from "../dtos/DashboardDto";

export class CustomerController {

    public async GetAdminDashboad(req: Request, res: Response, next: NextFunction) {
        let result: GetAdminDashboardDto | null = null
        let pending_installation = 0
        let completed_installation = 0
        let pending_requests = 0
        let closed_requests = 0
        let machines = 0
        let spares = 0
        let staff = 0
        let registered_products = 0
        let customers = 0
        let notifications = 0
        result = {
            pending_installation,
            completed_installation,
            pending_requests,
            closed_requests,
            machines,
            spares,
            staff,
            registered_products,
            customers,
            notifications,
        }
        return res.status(200).json(result)
    }

    public async GetEngineerDashboard(req: Request, res: Response, next: NextFunction) {
        let result: GetEngineerDashboardDto | null = null
        let pending_installation = 0
        let completed_installation = 0
        let pending_requests = 0
        let closed_requests = 0
        let notifications = 0
        result = {
            pending_installation,
            completed_installation,
            pending_requests,
            closed_requests,
            notifications,
        }
        return res.status(200).json(result)
    }
    public async GetSparesManagerDashboardDto(req: Request, res: Response, next: NextFunction) {
        let result: GetSparesManagerDashboardDto | null = null
        let pending_installation = 0;
        let completed_installation = 0;
        let pending_requests = 0;
        let closed_requests = 0;
        let notifications = 0;
        result = {
            pending_installation,
            completed_installation,
            pending_requests,
            closed_requests,
            notifications,
        }
        return res.status(200).json(result)
    }

    public async GetOwnerDashboardDto(req: Request, res: Response, next: NextFunction) {
        let result: GetOwnerDashboardDto | null = null
        let installations_requests = 0
        let service_requests = 0
        let staff = 0
        let registered_products = 0
        let notifications = 0
        result = {
            installations_requests,
            service_requests,
            staff,
            registered_products,
            notifications,
        }
        return res.status(200).json(result)
    }
    public async GetStaffDashboardDto(req: Request, res: Response, next: NextFunction) {
        let result: GetStaffDashboardDto | null = null
        let installations_requests = 0
        let service_requests = 0
        let registered_products = 0
        let notifications = 0
        result = {
            installations_requests,
            service_requests,
            registered_products,
            notifications,
        }
        return res.status(200).json(result)
    }
}