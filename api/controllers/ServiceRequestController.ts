import { NextFunction, Request, Response } from "express"
import moment from "moment"
import { generateServiceCode } from "../utils/generateServiceId"
import { CloseServiceRequestDto, CreateServiceRequestDto, GetServiceRequestDetailedDto, GetServiceRequestDto, HandleServiceRequestDto } from "../dtos/ServiceRequestDto"
import { IServiceRequest } from "../interfaces/ServiceRequestInterface"
import { RegisteredProduct } from "../models/RegisteredProductModel"
import { Problem, ServiceRequest, Solution } from "../models/ServiceRequestModel"
import { Asset } from "../interfaces/UserInterface"
import { uploadFileToCloud } from "../utils/uploadFile.util"
import { twillioClient } from "../app"
import { User } from "../models/UserModel"

export class ServiceRequestController {

    public async CreateServiceRequest(req: Request, res: Response, next: NextFunction) {
        let body = JSON.parse(req.body.body)
        const { product, problem } = body as CreateServiceRequestDto
        let item = await RegisteredProduct.findById(product)
        if (!item)
            return res.status(404).json({ message: 'product not found' });
        console.log(req.files)
        let requestid = generateServiceCode("kfm", "srv")
        let serv = await new ServiceRequest({
            request_id: requestid,
            product: item,
            customer: req.user.customer,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user,
            updated_by: req.user
        }).save()
        let photos: Asset[] = []
        let videos: Asset[] = []
        if (!req.files || !(req.files instanceof Array)) {
            return res.status(400).json({ message: "No files were uploaded." });
        }
        for (const file of req.files) {
            const { originalname, mimetype, size, buffer } = file;
            const storageLocation = `machines/media`;
            const doc = await uploadFileToCloud(buffer, storageLocation, originalname)

            if (mimetype.startsWith("image/")) {
                photos.push(doc);
            } else if (mimetype.startsWith("video/")) {
                videos.push(doc);
            }
        }
        await new Problem({
            problem, product, request: serv, photos, videos,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user,
            updated_by: req.user
        }).save()
        return res.status(201).json({ message: "success" })

    }
    public async HandleServiceRequest(req: Request, res: Response, next: NextFunction) {
        let body = JSON.parse(req.body.body)
        const { product, solution, request } = body as HandleServiceRequestDto
        let item = await RegisteredProduct.findById(product)
        if (!item)
            return res.status(404).json({ message: 'product not found' });
        let service = await ServiceRequest.findById(request)
        if (!service)
            return res.status(404).json({ message: 'service request not found' });


        let photos: Asset[] = []
        let videos: Asset[] = []
        if (!req.files || !(req.files instanceof Array)) {
            return res.status(400).json({ message: "No files were uploaded." });
        }
        for (const file of req.files) {
            const { originalname, mimetype, size, buffer } = file;
            const storageLocation = `machines/media`;
            const doc = await uploadFileToCloud(buffer, storageLocation, originalname)

            if (mimetype.startsWith("image/")) {
                photos.push(doc);
            } else if (mimetype.startsWith("video/")) {
                videos.push(doc);
            }
        }
        await new Solution({
            solution, product, request: service, photos, videos,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user,
            updated_by: req.user
        }).save()
        service.updated_by = req.user
        service.updated_by = req.user
        let code = Math.floor(100000 + Math.random() * 900000)
        service.happy_code = String(code)
        service.updated_at = new Date()
        await service.save()
        await this.sendHappyCode(String(req.user.mobile), `Dear Customer,Please Provide this Happy code to our Engineer To close This Service Request.\n\nYour Service id is ${service.request_id} \n\nRegards\nKFM INDIA`)
        return res.status(201).json({ message: "success" })

    }
    public async CloseServiceRequest(req: Request, res: Response, next: NextFunction) {
        const { code, paid_amount, payable_amount, paymentDate, paymentMode } = req.body as CloseServiceRequestDto
        let id = req.params.id
        let service = await ServiceRequest.findById(id)
        if (!service)
            return res.status(404).json({ message: "service not exists" })
        if (service.happy_code !== code)
            return res.status(400).json({ message: 'wrong happy code' })
        service.closed_by = req.user
        service.closed_on = new Date()
        service.paid_amount = paid_amount
        service.payable_amount = payable_amount
        service.paymentDate = new Date(paymentDate)
        service.paymentMode = paymentMode
        //@ts-ignore
        service.happy_code = undefined
        await service.save()
        return res.status(200).json({ message: 'service closed' })
    }
    public async sendHappyCode(phone: string, message: string) {
        await twillioClient.messages.create({
            body: `${message} \n\n Regards \nKFM INDIA`,
            from: process.env.twillioPhone,
            to: `+91${phone}`
        })
    }
    public async GetAllServiceRequests(req: Request, res: Response, next: NextFunction) {
        let requests: IServiceRequest[] = []
        let result: GetServiceRequestDto[] = []
        requests = await ServiceRequest.find().populate('approvedBy').populate({
            path: 'product', populate: [
                {
                    path: 'machine', model: 'Machine',

                },
                { path: 'customer', model: 'Customer' }
            ]
        })
            .populate('assigned_engineer').populate('closed_by').populate('created_by').populate('updated_by').sort('-created_at')

        result = requests.map((request) => {
            return {
                _id: request._id,
                request_id: request.request_id,
                product: { id: request.product.machine._id, label: request.product.machine.name },
                customer: { id: request.product.customer._id, label: request.product.customer.name },
                paymentMode: request.paymentMode || "",
                paymentDate: request.paymentDate ? moment(request.paymentDate).format("DD/MM/YYYY") : "",
                payable_amount: request.payable_amount || 0,
                paid_amount: request.paid_amount || 0,
                isApproved: request.isApproved ? true : false,
                approvedBy: request.approvedBy && { id: request.approvedBy._id, label: request.approvedBy.username },
                assigned_engineer: request.assigned_engineer && { id: request.assigned_engineer._id, label: request.assigned_engineer.username },
                closed_by: request.closed_by && { id: request.closed_by._id, label: request.closed_by.username },
                happy_code: request.happy_code || "",
                approved_on: request.approved_on && moment(request.approved_on).format("DD/MM/YYYY"),
                closed_on: request.closed_on && moment(request.closed_on).format("DD/MM/YYYY"),
                created_at: moment(request.created_at).format("DD/MM/YYYY"),
                updated_at: moment(request.updated_at).format("DD/MM/YYYY"),
                created_by: { id: request.created_by._id, label: request.created_by.username },
                updated_by: { id: request.updated_by._id, label: request.updated_by.username }
            }
        })
        return res.status(200).json(result)
    }
    public async GetAllServiceRequestsDetailed(req: Request, res: Response, next: NextFunction) {
        let result: GetServiceRequestDetailedDto | null = null
        let id = req.params.id
        let service = await ServiceRequest.findById(id).populate('approvedBy').populate({
            path: 'product', populate: [
                {
                    path: 'machine', model: 'Machine',

                },
                { path: 'customer', model: 'Customer' }
            ]
        })
            .populate('assigned_engineer').populate('closed_by')
        if (!service)
            return res.status(404).json({ message: "service not exists" })
        let problem = await Problem.findOne({ request: service }).populate('product')
        let solution = await Solution.findOne({ request: service }).populate('product')
        let users = await User.find({ customer: service.product.customer._id }).sort('username')
        let owner = await User.findOne({ role: 'owner', customer: service.product.customer._id })
        if (problem)
            result = {
                _id: service._id,
                request_id: service.request_id,
                product: {
                    _id: service.product._id,
                    sl_no: service.product.sl_no,
                    machine_photo: service.product.machine.photo?.public_url || "",
                    machine: { id: service.product.machine._id, label: service.product.machine.name },
                    customer: { id: service.product.customer._id, label: service.product.customer.name },
                    is_active: service.product.is_active,
                    isInstalled: service.product.isInstalled,
                    warrantyUpto: service.product.warrantyUpto ? new Date(service.product.warrantyUpto).toString() : "",
                    installationDate: service.product.installationDate ? new Date(service.product.installationDate).toString() : "",
                    created_at: moment(service.product.created_at).format("DD/MM/YYYY"),
                    updated_at: moment(service.product.updated_at).format("DD/MM/YYYY"),
                    created_by: { id: service.product.created_by._id, label: service.product.created_by.username },
                    updated_by: { id: service.product.updated_by._id, label: service.product.updated_by.username }
                },
                customer: {
                    _id: service.product.customer._id,
                    name: service.product.customer.name,
                    mobile: service.product.customer.mobile,
                    address: service.product.customer.address,
                    email: service.product.customer.email,
                    is_active: service.product.customer.is_active,
                    users: users.length || 0,
                    owner: owner?.username || "NA",
                    created_at: moment(service.product.customer.created_at).format("DD/MM/YYYY"),
                    updated_at: moment(service.product.customer.updated_at).format("DD/MM/YYYY"),
                    created_by: { id: service.product.customer.created_by._id, label: service.product.customer.created_by.username },
                    updated_by: { id: service.product.customer.updated_by._id, label: service.product.customer.updated_by.username }
                },
                problem: {
                    _id: problem._id,
                    problem: problem.problem,
                    videos: problem.videos.map((i) => { return i?.public_url || "" }),
                    photos: problem.photos.map((i) => { return i?.public_url || "" }),
                },
                solution: solution ? {
                    _id: solution._id,
                    solution: solution.solution,
                    videos: solution.videos.map((i) => { return i?.public_url || "" }),
                    photos: solution.photos.map((i) => { return i?.public_url || "" }),
                } : undefined,
                isApproved: service.isApproved ? true : false,
                assigned_engineer: service.assigned_engineer && { id: service.assigned_engineer._id, label: service.assigned_engineer.username },
                closed_by: service.closed_by && { id: service.closed_by._id, label: service.closed_by.username },
                closed_on: service.closed_on && moment(service.closed_on).format("DD/MM/YYYY"),

            }
            console.log(result)
        return res.status(200).json(result)
    }
}