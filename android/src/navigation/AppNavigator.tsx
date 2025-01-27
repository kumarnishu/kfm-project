import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  NavigationContainer, createNavigationContainerRef,
} from '@react-navigation/native';
import { UserContext } from '../contexts/UserContext';
import NotificationScreen from '../screens/NotificationScreen';
import { AlertContext } from '../contexts/AlertContext';
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import VideoLoader from "../components/common/VideoLoader"
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpVerifyScreen from '../screens/OtpVerifyScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AlertComponent from "../components/common/AlertComponent"
export const navigationRef = createNavigationContainerRef();

export const navigate = (name: string, params?: object) => {
  if (navigationRef.isReady()) {
    //@ts-ignore
    navigationRef.navigate(name, params);
  }
};

export type AuthenticatedStackParamList = {
  HomeScreen: undefined;
  NotificationScreen: undefined;
};

export type PublicStackParamList = {
  LoginScreen: undefined,
  OtpVerifyScreen: { mobile: string },
  RegisterScreen: undefined
};

const AuthenticatedStack = createStackNavigator<AuthenticatedStackParamList>();
const PublicStack = createStackNavigator<PublicStackParamList>();

const AuthenticatedNavigator = () => (
  <AuthenticatedStack.Navigator initialRouteName="HomeScreen" screenOptions={{ animation: 'fade', headerShown: false }}>
    <AuthenticatedStack.Screen name="HomeScreen" component={HomeScreen} />
    <AuthenticatedStack.Screen name="NotificationScreen" component={NotificationScreen} />
  </AuthenticatedStack.Navigator>
);

const PublicNavigator = () => (
  <PublicStack.Navigator initialRouteName="LoginScreen" screenOptions={{ animation: 'fade', headerShown: false }}>
    <PublicStack.Screen name="LoginScreen" component={LoginScreen} />
    <PublicStack.Screen name="OtpVerifyScreen" component={OtpVerifyScreen} />
    <PublicStack.Screen name="RegisterScreen" component={RegisterScreen} />
  </PublicStack.Navigator>
);

const AppNavigator = () => {
  const { user, isLoading } = useContext(UserContext);
  const { alert, setAlert } = useContext(AlertContext)

  if (isLoading)
    return (
      <NavigationContainer>
        <VideoLoader videoUrl={require('../assets/brand-video.mp4')} />
      </NavigationContainer>
    )



  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled = 
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   } else {
  //     Alert.alert('Permission denied');
  //   }
  // }

  // useEffect(() => {
  //   requestUserPermission();
  // }, []);

  // useEffect(() => {
  //   // Handle notification when app is in the foreground
  //   const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
  //     Alert.alert(
  //       remoteMessage.notification?.title,
  //       remoteMessage.notification?.body,
  //       [
  //         {
  //           text: 'OK',
  //           onPress: () => navigateToNotification(remoteMessage),
  //         }
  //       ]
  //     );
  //   });

  //   // Handle when the app is opened from background state
  //   messaging().onNotificationOpenedApp(remoteMessage => {
  //     navigateToNotification(remoteMessage);
  //   });

  //   // Handle when app is opened from quit state
  //   messaging().getInitialNotification().then(remoteMessage => {
  //     if (remoteMessage) {
  //       navigateToNotification(remoteMessage);
  //     }
  //   });

  //   return () => unsubscribeOnMessage();
  // }, []);

  // const navigateToNotification = (remoteMessage) => {
  //   console.log('Navigating to NotificationScreen with data:', remoteMessage.data);
  //   navigationRef.current?.navigate('Notification', { data: remoteMessage.data });
  // };

  // const getToken = async () => {
  //   const token = await messaging().getToken();
  //   console.log('FCM Token:', token);
  // };

  // useEffect(() => {
  //   getToken();
  // }, []);
  return (
    <NavigationContainer ref={navigationRef}>
      {user ?
        <AuthenticatedNavigator />
        : <PublicNavigator />}
      {alert && <AlertComponent />}
    </NavigationContainer>
  );

};


export default AppNavigator;
