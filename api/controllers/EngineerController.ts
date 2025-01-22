import { NextFunction, Request, Response } from 'express';
import moment from 'moment';
import { User } from '../models/UserModel';
import { DropDownDto } from '../dtos/DropDownDto';
import { CreateOrEditUserDto, GetUserDto } from '../dtos/UserDto';
import { IUser } from '../interfaces/UserInterface';
import isEmail from 'validator/lib/isEmail';
import { Customer } from '../models/CustomerModel';


export class EngineerController {
    public async CreateEngineer(req: Request, res: Response, next: NextFunction) {
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
            role: 'engineer',
            created_by: req.user,
            updated_by: req.user,
            created_at: new Date(),
            updated_at: new Date(),
        }).save()
        res.status(201).json({ message: "success" })
    }
    public async UpdateEngineer(req: Request, res: Response, next: NextFunction) {
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

        await  User.findByIdAndUpdate(id,{
            username,
            customer,
            email,
            mobile,
            updated_by: req.user,
            updated_at: new Date(),
        })
        res.status(201).json({ message: "success" })
    }
    public async GetAllEngineers(req: Request, res: Response, next: NextFunction) {

        let result: GetUserDto[] = []
        let users: IUser[] = await User.find({ role: 'engineer' }).populate("created_by").populate("updated_by").populate("customer").sort('-last_login')

        result = users.map((u) => {
            return {
                _id: u._id,
                username: u.username,
                email: u.email,
                mobile: u.mobile,
                role: u.role,
                customer: { id: u.customer._id, label: u.customer.name },
                dp: u.dp?.public_url || "",
                email_verified: u.email_verified,
                mobile_verified: u.mobile_verified,
                is_active: u.is_active,
                last_login: moment(u.last_login).format("lll"),
                created_at: moment(u.created_at).format("DD/MM/YYYY"),
                updated_at: moment(u.updated_at).format("DD/MM/YYYY"),
                created_by: { id: u.created_by._id, label: u.created_by.username },
                updated_by: { id: u.updated_by._id, label: u.updated_by.username }
            }
        })
        return res.status(200).json(result)
    }
    public async GetEngineersForDropdown(req: Request, res: Response, next: NextFunction) {
        let result: DropDownDto[] = []
        let users = await User.find({ role: 'engineer' }).sort('-last_login')

        result = users.map((u) => {
            return {
                id: u._id,
                label: u.username
            }
        })
        return res.status(200).json(result)
    }
}