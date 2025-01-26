import { NextFunction, Request, Response } from "express"
import { GetAdminDashboardDto, GetEngineerDashboardDto, GetOwnerDashboardDto, GetStaffDashboardDto } from "../dtos/DashboardDto";

export class CustomerController {

    public async GetAdminDashboad(req: Request, res: Response, next: NextFunction) {
        let result: GetAdminDashboardDto[] = []
        return res.status(200).json(result)
    }

    public async GetEngineerDashboard(req: Request, res: Response, next: NextFunction) {
        let result: GetEngineerDashboardDto[] = []
        return res.status(200).json(result)
    }
    public async GetSparesManagerDashboardDto(req: Request, res: Response, next: NextFunction) {
        let result: GetAdminDashboardDto[] = []
        return res.status(200).json(result)
    }

    public async GetOwnerDashboardDto(req: Request, res: Response, next: NextFunction) {
        let result: GetOwnerDashboardDto[] = []
        return res.status(200).json(result)
    }
    public async GetStaffDashboardDto(req: Request, res: Response, next: NextFunction) {
        let result: GetStaffDashboardDto[] = []
        return res.status(200).json(result)
    }
}