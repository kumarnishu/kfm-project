import { NextFunction, Request, Response } from "express"
import isEmail from "validator/lib/isEmail";
import { Customer } from "../models/CustomerModel";
import { CreateOrEditCustomerDto, GetCustomerDto } from "../dtos/CustomerDto";
import { DropDownDto } from "../dtos/DropDownDto";
import { CreateOrEditUserDto, GetUserDto } from "../dtos/UserDto";
import { ICustomer } from "../interfaces/CustomerInterface";
import { IUser } from "../interfaces/UserInterface";
import { User } from "../models/UserModel";

export class CustomerController {

    public async CreateCustomerFromAdmin(req: Request, res: Response, next: NextFunction) {
        let {
            name,
            username,
            mobile,
            email,
            address,
        } = req.body as CreateOrEditCustomerDto

        // validations
        if (!name || !username || !address || !mobile)
            return res.status(400).json({ message: "fill all the required fields" });
        if (!isEmail(email))
            return res.status(400).json({ message: "please provide valid email id" });
        if (await User.findOne({ mobile: mobile.trim().toLowerCase() }))
            return res.status(403).json({ message: `${mobile} already exists` });
        if (await Customer.findOne({ mobile: mobile.toLowerCase().trim() }))
            return res.status(403).json({ message: `${mobile} already exists` });
        if (await User.findOne({ email: email.toLowerCase().trim() }))
            return res.status(403).json({ message: `${email} already exists` });
        if (await Customer.findOne({ email: email.toLowerCase().trim() }))
            return res.status(403).json({ message: `${email} already exists` });


        let newCustomer = new Customer({
            mobile,
            email,
            name,
            username,
            address,
            created_at: new Date(),
            updated_at: new Date(),
        })

        let user = new User({
            mobile,
            email,
            username,
            customer: newCustomer,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        })
        user.created_by = user
        user.updated_by = user
        newCustomer.created_by = user
        newCustomer.updated_by = user
        user.role = "owner"
        user.is_active = true
        await newCustomer.save()
        await user.save();
        res.status(201).json({ message: "success" })
    }
    public async UpdateCustomerFromOwner(req: Request, res: Response, next: NextFunction) {
        let {
            name,
            mobile,
            email,
            address,
        } = req.body as CreateOrEditCustomerDto

        // validations
        if (!name || !address || !mobile)
            return res.status(400).json({ message: "fill all the required fields" });
        if (!isEmail(email))
            return res.status(400).json({ message: "please provide valid email id" });

        let id = req.params.id
        let customer = await Customer.findById(id)
        if (!customer)
            return res.status(404).json({ message: 'customer not exists' })

        if (mobile != customer.mobile) {
            if (await Customer.findOne({ mobile: mobile }))
                return res.status(403).json({ message: `${mobile} already exists` });
        }
        //check email
        if (email !== customer.email) {
            if (await Customer.findOne({ email: String(email).toLowerCase().trim() }))
                return res.status(403).json({ message: `${email} already exists` });
        }
        customer.mobile = mobile
        customer.email = email
        customer.address = address
        customer.updated_at = new Date()
        customer.created_by = req.user
        customer.updated_by = req.user
        await customer.save()
        res.status(200).json({ message: "success" })
    }
    public async CreateStaff(req: Request, res: Response, next: NextFunction) {
        let { username, mobile, email, customer } = req.body as CreateOrEditUserDto;
        // validations
        if (!mobile)
            return res.status(400).json({ message: "fill all the required fields" });
        if (email && !isEmail(email))
            return res.status(400).json({ message: "please provide valid email" });

        if (email && await User.findOne({ email: email.toLowerCase().trim() }))
            return res.status(403).json({ message: `${email} already exists` });
        if (await User.findOne({ mobile: mobile }))
            return res.status(403).json({ message: `${mobile} already exists` });
        if (!await Customer.findById(customer))
            return res.status(403).json({ message: `customer not exists` });

        await new User({
            username,
            customer,
            email,
            mobile,
            role: 'staff',
            created_by: req.user,
            updated_by: req.user,
            created_at: new Date(),
            updated_at: new Date(),
        }).save()
        res.status(201).json({ message: "success" })
    }
    public async UpdateStaff(req: Request, res: Response, next: NextFunction) {
        let { username, mobile, email, customer } = req.body as CreateOrEditUserDto;
        let id = req.params.id
        let user = await User.findById(id)
        if (!user)
            return res.status(404).json({ message: "user not exists" })
        // validations
        if (mobile != user.mobile) {
            if (await User.findOne({ mobile: mobile }))
                return res.status(403).json({ message: `${mobile} already exists` });
        }
        //check email
        if (email !== user.email) {
            if (await User.findOne({ email: String(email).toLowerCase().trim() }))
                return res.status(403).json({ message: `${email} already exists` });
        }

        if (!await Customer.findById(customer))
            return res.status(403).json({ message: `customer not exists` });

        await new User({
            username,
            customer,
            email,
            mobile,
            role: 'staff',
            created_by: req.user,
            updated_by: req.user,
            created_at: new Date(),
            updated_at: new Date(),
        }).save()
        res.status(201).json({ message: "success" })
    }
    public async GetAllCustomers(req: Request, res: Response, next: NextFunction) {
        let search = req.query.search
        let customers: ICustomer[] = []
        let result: GetCustomerDto[] = []
        if (search)
            customers = await Customer.find(
                {
                    $or: [
                        { mobile: { $regex: search, $options: 'i' } },
                        { name: { $regex: search, $options: 'i' } },
                    ]
                }).populate('created_by').populate('updated_by').sort('-created_at').limit(10)
        else
            customers = await Customer.find().populate('created_by').populate('updated_by').sort('-created_at').limit(10)

        for (let i = 0; i < customers.length; i++) {
            let customer = customers[i]
            let users = await User.find({ customer: customer._id }).sort('username')
            let owner = await User.findOne({ role: 'owner', customer: customer._id })
            result.push({
                _id: customer._id,
                name: customer.name,
                mobile: customer.mobile,
                owner: owner ? owner.username : "NA",
                address: customer.address,
                email: customer.email,
                users: users.length || 0,
            })
        }
        return res.status(200).json(result)
    }

    public async GetCustomersForDropdown(req: Request, res: Response, next: NextFunction) {
        let customers: ICustomer[] = []
        let result: DropDownDto[] = []
        customers = await Customer.find().populate('created_by').populate('updated_by').sort('-created_at')
        result = customers.map((c) => { return { id: c._id, label: c.name, value: c.name } })

        return res.status(200).json(result)
    }
    public async GetSelectedCustomerStaffForAdmin(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id
        let search = req.query.search
        let result: GetUserDto[] = []
        let users: IUser[] = []
        if (search)
            users = await User.find({
                customer: id, $or: [
                    { mobile: { $regex: search, $options: 'i' } },
                    { username: { $regex: search, $options: 'i' } }
                ]
            }).populate("created_by").populate("updated_by").populate("customer").sort('-last_login').limit(10)
        else
            users = await User.find({ customer: id }).populate("created_by").populate("updated_by").populate("customer").sort('-last_login').limit(10)

        result = users.map((u) => {
            return {
                _id: u._id,
                username: u.username,
                email: u.email,
                mobile: u.mobile,
                role: u.role,
                customer: { id: u.customer._id, label: u.customer.name },
                dp: u.dp?.public_url || ""
            }
        })
        return res.status(200).json(result)
    }
    public async GetAllStaff(req: Request, res: Response, next: NextFunction) {

        let result: GetUserDto[] = []
        let users: IUser[] = await User.find({ role: 'staff', customer: req.user.customer }).populate("created_by").populate("updated_by").populate("customer").sort('-last_login')

        result = users.map((u) => {
            return {
                _id: u._id,
                username: u.username,
                email: u.email,
                mobile: u.mobile,
                role: u.role,
                customer: { id: u.customer._id, label: u.customer.name },
                dp: u.dp?.public_url || ""
            }
        })
        return res.status(200).json(result)
    }
    public async GetStaffsForDropdown(req: Request, res: Response, next: NextFunction) {
        let result: DropDownDto[] = []
        let users = await User.find({ role: 'staff', customer: req.user.customer }).sort('-last_login')

        result = users.map((u) => {
            return {
                id: u._id,
                label: u.username
            }
        })
        return res.status(200).json(result)
    }
}