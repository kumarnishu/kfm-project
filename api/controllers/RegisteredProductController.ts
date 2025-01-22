import { NextFunction, Request, Response } from "express"
import moment from "moment"
import { CreateOrEditRegisteredProductDto, GetRegisteredProductDto } from "../dtos/RegisteredProducDto"
import { RegisteredProduct } from "../models/RegisteredProductModel"
import { Customer } from "../models/CustomerModel"
import { Machine } from "../models/MachineModel"
import { IRegisteredProduct } from "../interfaces/RegisteredProductInterface"

export class RegisteredProductController {

    public async CreateRegisteredProduct(req: Request, res: Response, next: NextFunction) {
        const {
            sl_no,
            machine,
            customer,
            warrantyUpto,
            isInstalled,
            installationDate
        } = req.body as CreateOrEditRegisteredProductDto
        if (!sl_no || !machine || !customer) {
            return res.status(400).json({ message: "please fill all required fields" })
        }

        if (await RegisteredProduct.findOne({ sl_no: sl_no.toLowerCase() }))
            return res.status(400).json({ message: "already exists this product" })

        let product = await new RegisteredProduct({
            sl_no, machine, customer, isInstalled,
            created_at: new Date(),
            updated_at: new Date(),
            created_by: req.user,
            updated_by: req.user
        })
        if (warrantyUpto)
            product.warrantyUpto = new Date(warrantyUpto);
        if (installationDate)
            product.installationDate = new Date(installationDate);
        await product.save()
        return res.status(201).json({ message: "success" })

    }
    public async UpdateRegisteredProduct(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id
        let productTmp = await RegisteredProduct.findById(id)
        if (!productTmp)
            return res.status(404).json({ message: "part not found" })
        const {
            sl_no,
            machine,
            customer,
            warrantyUpto,
            isInstalled,
            installationDate } = req.body as CreateOrEditRegisteredProductDto
        if (!sl_no || !machine || !customer) {
            return res.status(400).json({ message: "please fill all required fields" })
        }
        if (productTmp.sl_no !== sl_no.toLowerCase())
            if (await RegisteredProduct.findOne({ sl_no: sl_no.toLowerCase() }))
                return res.status(400).json({ message: "already exists this register product" })
        productTmp.sl_no = sl_no;
        if (customer) {
            let obj = await Customer.findById(customer)
            if (obj)
                productTmp.customer = obj;
        }
        if (machine) {
            let obj = await Machine.findById(machine)
            if (obj)
                productTmp.machine = obj;
        }
        productTmp.isInstalled = isInstalled;
        productTmp.updated_at = new Date();

        if (warrantyUpto)
            productTmp.warrantyUpto = new Date(warrantyUpto);
        if (installationDate)
            productTmp.installationDate = new Date(installationDate);
        if (req.user)
            productTmp.updated_by = req.user
        await productTmp.save()
        return res.status(200).json({ message: "updated" })

    }

    public async GetAllRegisteredProducts(req: Request, res: Response, next: NextFunction) {
        let products: IRegisteredProduct[] = []
        let result: GetRegisteredProductDto[] = []
        products = await RegisteredProduct.find({ customer: req.user.customer }).populate('machine').populate('customer').populate('created_by').populate('updated_by').sort('-created_at')

        for (let i = 0; i < products.length; i++) {
            let product = products[i]
            result.push({
                _id: product._id,
                sl_no: product.sl_no,
                machine_photo: product.machine.photo?.public_url || "",
                machine: { id: product.machine._id, label: product.machine.name },
                customer: { id: product.customer._id, label: product.customer.name },
                is_active: product.is_active,
                isInstalled: product.isInstalled,
                warrantyUpto: product.warrantyUpto?new Date(product.warrantyUpto).toString() :"",
                installationDate: product.installationDate?new Date(product.installationDate).toString() : "",
                created_at: moment(product.created_at).format("DD/MM/YYYY"),
                updated_at: moment(product.updated_at).format("DD/MM/YYYY"),
                created_by: { id: product.created_by._id, label: product.created_by.username },
                updated_by: { id: product.updated_by._id, label: product.updated_by.username }
            })
        }
        return res.status(200).json(result)
    }
}