import { IUser } from "./UserInterface"

export type INotification = {
    _id: string
    title: string,
    body: string,
    status: string,
    recepient: IUser
    created_at: Date,
    send_at:Date
}