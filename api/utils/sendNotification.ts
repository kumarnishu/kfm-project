const admin = require('./firebaseAdmin');

async function sendNotification(token, title, body) {
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

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

// Example usage
const fcmToken = 'YOUR_DEVICE_FCM_TOKEN';
sendNotification(fcmToken, 'Hello', 'This is a test notification');
