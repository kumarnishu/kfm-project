import { NextFunction, Request, Response } from "express"
import moment from "moment"
import { CreateServiceRequestDto, CreateServiceRequestPaymentDto, CreateServiceRequestSolutionDto, GetServiceRequestDetailedDto, GetServiceRequestDto } from "../dtos/ServiceRequestDto"
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
        let count = await ServiceRequest.countDocuments()
        if (!item)
            return res.status(404).json({ message: 'product not found' });
        let requestid = generateServiceCode(count + 1)
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
    public async CreateServiceRequestSolution(req: Request, res: Response, next: NextFunction) {
        let body = JSON.parse(req.body.body)
        const { solution, request, parts } = body as CreateServiceRequestSolutionDto

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
            solution, parts, request: service, photos, videos,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user,
            updated_by: req.user
        }).save()
        service.updated_by = req.user
        service.updated_by = req.user
        await service.save()
        return res.status(201).json({ message: "success" })

    }
    public async CloseServiceRequest(req: Request, res: Response, next: NextFunction) {
        const { code } = req.body as { code: string }
        let id = req.params.id
        let service = await ServiceRequest.findById(id)
        if (!service)
            return res.status(404).json({ message: "service not exists" })
        if (service.happy_code !== code)
            return res.status(400).json({ message: 'wrong happy code' })
        service.closed_by = req.user
        service.closed_on = new Date()
        //@ts-ignore
        service.happy_code = undefined
        await service.save()
        return res.status(200).json({ message: 'service closed' })
    }

    public async CreateServiceRequestPayment(req: Request, res: Response, next: NextFunction) {
        const { cash_payment,
            upi_payment,
            paymentmode,
            payable_amount,
            discount_amount,
            paid_amount, } = req.body as CreateServiceRequestPaymentDto
        let id = req.params.id
        let service = await ServiceRequest.findById(id)
        if (!service)
            return res.status(404).json({ message: "service not exists" })

        service.paid_amount = paid_amount
        service.payable_amount = payable_amount
        service.cash_payment = cash_payment
        service.upi_payment = upi_payment
        service.paymentmode = paymentmode
        service.discount_amount = discount_amount
        service.paymentDate = new Date()

        let code = Math.floor(1000 + Math.random() * 9000)
        service.happy_code = String(code)
        service.updated_at = new Date()
        await service.save()
        await this.sendHappyCode(String(req.user.mobile), `Dear Customer,Please Provide this Happy code to our Engineer To close This Service Request.\n\nYour Service id is ${service.request_id} \n\nRegards\nKFM INDIA`)
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
        requests = await ServiceRequest.find().populate('approvedBy')
            .populate('product')
            .populate('machine')
            .populate('problem')
            .populate('solution')
            .populate('customer')
            .populate('assigned_engineer').populate('closed_by').populate('created_by').sort('-created_at')

        result = requests.map((request) => {
            return {
                _id: request._id,
                request_id: request.request_id,
                customer: request.customer.name,
                contactno: request.customer.mobile,
                machine: request.machine.name,
                machine_model: request.machine.model,
                problem: request.problem.problem,
                assigned_engineer: {
                    _id: request.assigned_engineer._id,
                    username: request.assigned_engineer.username,
                    email: request.assigned_engineer.email,
                    mobile: request.assigned_engineer.mobile,
                    role: request.assigned_engineer.role,
                    customer: { id: request.assigned_engineer.customer._id, label: request.assigned_engineer.customer.name },
                    dp: ""
                },
                closed_by: { id: request.closed_by.customer._id, label: request.closed_by.customer.name },
                closed_on: request.closed_on ? moment(request.closed_on).format("DD-MM-YYYY") : "",
                created_at: moment(request.created_at).format("DD-MM-YYYY"),
                created_by: { id: request.created_by.customer._id, label: request.created_by.customer.name }
            }
        })
        return res.status(200).json(result)
    }
    public async GetAllServiceRequestsDetailed(req: Request, res: Response, next: NextFunction) {
        let result: GetServiceRequestDetailedDto | null = null
        let id = req.params.id

        let service = await ServiceRequest.findById(id).populate('approvedBy')
            .populate('product')
            .populate('machine')
            .populate('customer')
            .populate('problem')
            .populate({
                path: 'solution', populate: [
                    {
                        path: 'parts', model: 'SparePart',

                    }
                ]
            })
            .populate('assigned_engineer').populate('closed_by').populate('created_by').sort('-created_at')

        if (!service)
            return res.status(404).json({ message: "service not exists" })


        let users = await User.find({ customer: service.customer._id }).sort('username')
        let owner = await User.findOne({ role: 'owner', customer: service.customer._id })

        result = {
            _id: service._id,
            request_id: service.request_id,
            customer: {
                _id: service.customer._id,
                name: service.customer.name,
                mobile: service.customer.mobile,
                owner: owner ? owner.username : "NA",
                address: service.customer.address,
                email: service.customer.email,
                users: users.length || 0,
            },
            machine: {
                _id: service.machine._id,
                name: service.machine.name,
                model: service.machine.model,
                photo: service.machine.photo?.public_url || ""
            },
            product_serialno: service.product.sl_no,
            problem: {
                _id: service.problem._id,
                problem: service.problem.problem,
                videos: service.problem.videos ? service.problem.videos.map((i) => { return i?.public_url }) : [],
                photos: service.problem.photos ? service.problem.photos.map((i) => { return i?.public_url }) : []
            },

            solution: service.solution && {
                _id: service.solution._id,
                solution: service.solution.solution,
                parts: service.solution.parts.map((part) => {
                    return {
                        _id: part._id,
                        name: part.name,
                        price: part.price,
                        partno: part.partno,
                        photo: part.photo?.public_url || ""
                    }
                }),
                videos: service.solution.videos ? service.solution.videos.map((i) => { return i?.public_url }) : [],
                photos: service.solution.photos ? service.solution.photos.map((i) => { return i?.public_url }) : []
            },
            assigned_engineer: {
                _id: service.assigned_engineer._id,
                username: service.assigned_engineer.username,
                email: service.assigned_engineer.email,
                mobile: service.assigned_engineer.mobile,
                role: service.assigned_engineer.role,
                customer: { id: service.assigned_engineer.customer._id, label: service.assigned_engineer.customer.name },
                dp: ""
            },
            closed_by: { id: service.closed_by.customer._id, label: service.closed_by.customer.name },
            closed_on: service.closed_on ? moment(service.closed_on).format("DD-MM-YYYY") : "",
            created_at: moment(service.created_at).format("DD-MM-YYYY"),
            created_by: { id: service.created_by.customer._id, label: service.created_by.customer.name }
        }
        return res.status(200).json(result)
    }
}