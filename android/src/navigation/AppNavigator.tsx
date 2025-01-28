import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  NavigationContainer, createNavigationContainerRef,
} from '@react-navigation/native';
import { UserContext } from '../contexts/UserContext';
import NotificationScreen from '../screens/NotificationScreen';
import { AlertContext } from '../contexts/AlertContext';
import { Alert } from 'react-native';
// import PushNotification from 'react-native-push-notification';
import VideoLoader from "../components/common/VideoLoader"
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpVerifyScreen from '../screens/OtpVerifyScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AlertComponent from "../components/common/AlertComponent"
import Navbar from '../components/common/NavBar';
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



  // useEffect(() => {
  //   PushNotification.configure({
  //     onRegister: function (token) {
  //       console.log("TOKEN:", token);
  //     },
  //     onNotification: function (notification) {
  //       console.log("NOTIFICATION:", notification);
  //       notification.finish(PushNotification.FetchResult.NoData);
  //     },
  //     onAction: function (notification) {
  //       console.log("ACTION:", notification);
  //     },
  //     onRegistrationError: function (err) {
  //       console.error(err.message, err);
  //     },
  //     requestPermissions: true,
  //   });
  // }, [])

  if (isLoading)
    return (
      <NavigationContainer>
        <VideoLoader videoUrl={require('../assets/brand-video.mp4')} />
      </NavigationContainer>
    )

  return (
    <NavigationContainer ref={navigationRef}>
      {user ?
        <>
          <Navbar />
          <AuthenticatedNavigator />
        </>
        : <PublicNavigator />}
      {alert && <AlertComponent />}
    </NavigationContainer>
  );

};


export default AppNavigator;
