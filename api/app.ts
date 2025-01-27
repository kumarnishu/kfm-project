import express, { NextFunction, Request, Response } from 'express';
import compression from "compression"
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { MulterError } from 'multer';
import { connectDatabase } from './config/db';
import UserRoutes from "./routes/user.routes";
import MachineRoutes from "./routes/machine.routes";
import ServiceRequestRoutes from "./routes/service.request.routes";
import RegisteredProductRoutes from "./routes/registerd.product.routes";
import SparePartsRoutes from "./routes/spareparts.route"
import EngineerRoutes from "./routes/engineer.route"
import CustomerRoutes from "./routes/customer.route"
import path from 'path';
import { Storage } from '@google-cloud/storage';
import morgan from 'morgan';
import { Twilio } from 'twilio';
import { activateFirebaseNotifications } from './services/sendNotification';


const app = express()


//env setup
dotenv.config();
const PORT = Number(process.env.PORT) || 5000
const HOST = process.env.HOST || "http://localhost"
const ENV = process.env.NODE_ENV || "development"

app.use(express.json({ limit: '30mb' }))
app.use(cookieParser());
app.use(compression())

//logger
app.use(morgan('common'))


//mongodb database
connectDatabase();

let origin = ""
if (ENV === "development") {
    origin = "http://localhost:3000"
    let origin2 = "http://localhost:8081"
    app.use(cors({
        origin: [origin, origin2],
        credentials: true
    }))
}

if (ENV === "production") {
    origin = "https://agarson-client.netlify.app"
    let origin2 = "https://agarson-client.onrender.com"
    app.use(cors({
        origin: [origin, origin2],
        credentials: true
    }))
}

activateFirebaseNotifications()

//cloud storage setupu config

const storage = new Storage({
    projectId: process.env.projectId,
    credentials: {
        type: process.env.type,
        private_key: process.env.private_key,
        client_email: process.env.client_email,
        client_id: process.env.client_id,
        universe_domain: process.env.universe_domain
    }
})

export const bucketName = String(process.env.bucketName)
export const bucket = storage.bucket(bucketName)

const accountSid = process.env.accountSid;
const authToken = process.env.authToken;
export const twillioClient = new Twilio(accountSid, authToken);

//server routes
app.use("/api/v1", UserRoutes)
app.use("/api/v1", MachineRoutes)
app.use("/api/v1", SparePartsRoutes)
app.use("/api/v1", RegisteredProductRoutes)
app.use("/api/v1", ServiceRequestRoutes)
app.use("/api/v1", EngineerRoutes)
app.use("/api/v1", CustomerRoutes)

//react app handler
if (ENV === "production") {
    app.use(express.static(path.join(__dirname, "build")))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, "build/", "index.html"));
    })
}
else {
    app.use("*", (_req: Request, res: Response, _next: NextFunction) => {
        res.status(404).json({ message: "resource not found" })
    })
}
//error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    if (err instanceof MulterError)
        return res.status(400).json({ message: "please select required no of files and field names" })
    res.status(500).json({
        message: err.message || "unknown  error occured"
    })
})

//server setup
if (!PORT) {
    console.log("Server Port not specified in the environment")
    process.exit(1)
}
app.listen(PORT, () => {
    console.log(`running on ${HOST}:${PORT}`)
});

