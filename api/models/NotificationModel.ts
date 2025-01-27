import mongoose from "mongoose"
import { INotification } from "../interfaces/NotificationIterface"

const NotificationSchema = new mongoose.Schema<INotification, mongoose.Model<INotification, {}, {}>, {}>({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    recepient:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: String,
    send_at: Date,
    created_at: {
        type: Date,
        default: new Date(),
        required: true,
    }
})

export const Notification = mongoose.model<INotification, mongoose.Model<INotification, {}, {}>>("Notification", NotificationSchema)