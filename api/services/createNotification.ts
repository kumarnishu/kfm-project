import { IUser } from "../interfaces/UserInterface";
import { Notification } from "../models/NotificationModel";

export async function createFirebaseNotification(title: string, body: string, recepient: IUser) {
    await new Notification({
        title, body, status: 'pending', created_at: new Date(), recepient: recepient._id
    }).save()
}