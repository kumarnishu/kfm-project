import { NextFunction, Request, Response } from 'express';
import { deleteToken, sendUserToken } from '../middlewares/auth.middleware';
import isEmail from "validator/lib/isEmail";
import { sendEmail } from '../utils/sendEmail.util';
import { Customer } from '../models/CustomerModel';
import { User } from '../models/UserModel';
import { CreateOrEditCustomerDto } from '../dtos/CustomerDto';
import { GetUserDto, LoginDto, SendOrVerifyEmailDto } from '../dtos/UserDto';



export class UserController {

    public async SignUpAsCustomerOrAdmin(req: Request, res: Response, next: NextFunction) {

        let {
            name,
            mobile,
            username,
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
            address,
            created_at: new Date(),
            updated_at: new Date(),
        })

        let user = new User({
            username: username ? username : name,
            mobile,
            email,
            customer: newCustomer,
            is_active: true,
            created_at: new Date(),
            updated_at: new Date(),
        })
        user.created_by = user
        user.updated_by = user
        newCustomer.created_by = user
        newCustomer.updated_by = user

        let customer = await Customer.findOne()
        if (!customer) {
            user.role = "admin"
        }
        else {
            user.role = "owner"
            user.is_active = true
        }
        await newCustomer.save()
        await user.save();
        res.status(201).json({ message: "success" })
    }
    public async CheckOtpAndLogin(req: Request, res: Response, next: NextFunction) {
        let result: GetUserDto | null = null;
        const { mobile, otp } = req.body as { mobile: string, otp: number }
        let user = await User.findOne({ mobile: String(mobile).trim().toLowerCase() })
        if (!user)
            return res.status(404).json({ message: 'user not found' })

        if (!user.checkOtpValidity(otp))
            return res.status(400).json({ message: 'otp invalid or expired' })
        sendUserToken(res, user.getAccessToken())
        user.last_login = new Date()
        let token = user.getAccessToken()
        //@ts-ignore
        user.otp = undefined
        //@ts-ignore
        user.otp_valid_upto = undefined
        await user.save()
        result = {
            _id: user._id,
            username: user.username,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            customer: { id: user.customer._id, label: user.customer.name },
            dp: ""
        }
        res.status(200).json({ user: result, token: token })
    }
    public async UpdateFcmToken(req: Request, res: Response, next: NextFunction) {
        let id = req.params.id
        let { token } = req.body as { token: string }
        await User.findByIdAndUpdate(id, { fcm_token: token })
        res.status(200).json({ message: "success" })
    }
    public async GetProfile(req: Request, res: Response, next: NextFunction) {
        let result: GetUserDto | null = null;
        const user = await User.findById(req.user?._id).populate("created_by").populate("customer").populate("updated_by")
        if (user)
            result = {
                _id: user._id,
                username: user.username,
                email: user.email,
                mobile: user.mobile,
                role: user.role,
                customer: { id: user.customer._id, label: user.customer.name },
                dp: ""
            }
        res.status(200).json({ user: result, token: req.cookies.accessToken })
    }
    public async SendOtp(req: Request, res: Response, next: NextFunction) {
        const { mobile } = req.body as LoginDto
        if (!mobile)
            return res.status(400).json({ message: "please enter mobile" })

        let user = await User.findOne({ mobile: String(mobile).trim().toLowerCase() }).populate('customer').populate('created_by').populate('updated_by')
        if (!user)
            return res.status(403).json({ message: "mobile number not exists." })

        if (!user.is_active)
            return res.status(401).json({ message: "you are blocked, contact admin" })
        await user.sendOtp(mobile)
        await user.save();
        res.status(200).json({ message: "success" })
    }
    public async Logout(req: Request, res: Response, next: NextFunction) {
        let coToken = req.cookies.accessToken
        let AuthToken = req.headers.authorization && req.headers.authorization.split(" ")[1]
        if (coToken)
            await deleteToken(res, coToken);
        if (AuthToken)
            await deleteToken(res, AuthToken);
        res.status(200).json({ message: "logged out" })
    }
    public async SendEmailVerificationLink(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body as SendOrVerifyEmailDto
        if (!email)
            return res.status(400).json({ message: "please provide your email id" })
        const userEmail = String(email).toLowerCase().trim();
        if (!isEmail(userEmail))
            return res.status(400).json({ message: "provide a valid email" })
        const user = await User.findOne({ email: userEmail })
        if (!user)
            return res.status(404).json({ message: "you have no account with this email id" })
        const verifyToken = await user.getEmailVerifyToken();
        await user.save();
        const emailVerficationUrl = `${process.env.HOST}/email/verify/${verifyToken}`


        const message = `Your email verification link is :- \n\n ${emailVerficationUrl} \n\n valid for 15 minutes only \n\nIf you have not requested this email then, please ignore it.`;
        const options = {
            to: user.email,
            subject: `Kfm India Email Verification`,
            message,
        };

        let response = await sendEmail(options);
        if (response) {
            return res.status(200).json({
                message: `Email sent to ${user.email} successfully`,
            })
        }
        else {
            user.emailVerifyToken = null;
            user.emailVerifyExpire = null;
            await user.save();
            return res.status(500).json({ message: "email could not be sent, something went wrong" })
        }
    }
    public async VerifyEmail(req: Request, res: Response, next: NextFunction) {
        const emailVerifyToken = req.params.token;
        let user = await User.findOne({
            emailVerifyToken,
            emailVerifyExpire: { $gt: Date.now() },
        });
        if (!user)
            return res.status(403).json({ message: "Email verification Link  is invalid or has been expired" })
        user.email_verified = true;
        user.emailVerifyToken = null;
        user.emailVerifyExpire = null;
        await user.save();
        res.status(200).json({
            message: `congrats ${user.email} verification successful`
        });
    }
}