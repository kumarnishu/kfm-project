import { CronJob } from "cron";
import fireAdmin from "../config/firebase.config"
import { Notification } from "../models/NotificationModel";
import { INotification } from "../interfaces/NotificationIterface";

export async function activateFirebaseNotifications() {
  // daily 
  console.log("notifcation started to send")
  new CronJob("1/1 * * * *", async () => {
    let notifications = await Notification.find({ status:{$ne:'sent'} }).populate('recepient').sort('-created_at')
    for (let i = 0; i < notifications.length; i++) {
      if (notifications[i].recepient && notifications[i].recepient.fcm_token)
        await sendNotification(notifications[i])
      else {
        await Notification.findByIdAndUpdate(notifications[i]._id, { status: 'token not exists', send_at: new Date() })
      }
    }
  }).start()


}
async function sendNotification(notification: INotification) {
  try {
    let title = notification.title
    let body = notification.body
    let token = notification.recepient.fcm_token

    const message = {
      token: token, // FCM device token
      notification: {
        title: title,
        body: body,
      },
      data: {
        customData: 'Your custom data here',
      },
    };

    await fireAdmin.messaging().send(message);
    await Notification.findByIdAndUpdate(notification._id, { status: 'sent', send_at: new Date() })
  } catch (error) {
    await Notification.findByIdAndUpdate(notification._id, { status: 'error', send_at: new Date() })
    console.error('Error sending notification:', error);
  }
}
