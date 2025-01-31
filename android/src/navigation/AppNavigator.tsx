import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  CommonActions,
  NavigationContainer, createNavigationContainerRef,
} from '@react-navigation/native';
import { UserContext } from '../contexts/UserContext';
import NotificationScreen from '../screens/NotificationScreen';
import { AlertContext } from '../contexts/AlertContext';
import { Alert } from 'react-native';
import VideoLoader from "../components/common/VideoLoader"
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpVerifyScreen from '../screens/OtpVerifyScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AlertComponent from "../components/common/AlertComponent"
import Navbar from '../components/common/NavBar';
export const navigationRef = createNavigationContainerRef();
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomerDetailsScreen, EngineerDetailsScreen, MachineDetailsScreen, ProductDetailsScreen, ServiceRequestDetailsScreen, SpareDetailsScreen, StaffDetailsScreen } from "../screens/details"
import { CustomersScreen, EngineersScreen, MachinesScreen, ProductsScreen, ServiceRequestsScreen, SparesScreen, StaffsScreen } from "../screens/main"
import { setupInterceptors } from '../services/utils/axiosIterceptor';

export const navigate = (name: string, params?: object) => {
  if (navigationRef.isReady()) {
    //@ts-ignore
    navigationRef.navigate(name, params);
  }
};

export const replaceScreen = (screenName: string, params?: object) => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: screenName, params }],
      })
    );
  }
};

export type AuthenticatedStackParamList = {
  HomeScreen: undefined;
  NotificationScreen: undefined;
  CustomerDetailsScreen: { id: string, data: { company: string, address: string, email: string, mobile: string } }; // Example parameter
  CustomersScreen: undefined
  MachineDetailsScreen: { id: string }; // Example parameter
  MachinesScreen: undefined
  SpareDetailsScreen: { id: string }; // Example parameter
  SparesScreen: undefined
  EngineerDetailsScreen: { id: string }; // Example parameter
  EngineersScreen: undefined
  StaffDetailsScreen: { id: string }; // Example parameter
  StaffsScreen: undefined
  ProductDetailsScreen: { id: string }; // Example parameter
  ProductsScreen: undefined
  ServiceRequestDetailsScreen: { id: string }; // Example parameter
  ServiceRequestsScreen: undefined
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
    <AuthenticatedStack.Screen name="CustomersScreen" component={CustomersScreen} />
    <AuthenticatedStack.Screen name="CustomerDetailsScreen" component={CustomerDetailsScreen} />
    <AuthenticatedStack.Screen name="MachinesScreen" component={MachinesScreen} />
    <AuthenticatedStack.Screen name="MachineDetailsScreen" component={MachineDetailsScreen} />
    <AuthenticatedStack.Screen name="SparesScreen" component={SparesScreen} />
    <AuthenticatedStack.Screen name="SpareDetailsScreen" component={SpareDetailsScreen} />
    <AuthenticatedStack.Screen name="ProductsScreen" component={ProductsScreen} />
    <AuthenticatedStack.Screen name="ProductDetailsScreen" component={ProductDetailsScreen} />
    <AuthenticatedStack.Screen name="EngineersScreen" component={EngineersScreen} />
    <AuthenticatedStack.Screen name="EngineerDetailsScreen" component={EngineerDetailsScreen} />
    <AuthenticatedStack.Screen name="StaffsScreen" component={StaffsScreen} />
    <AuthenticatedStack.Screen name="StaffDetailsScreen" component={StaffDetailsScreen} />
    <AuthenticatedStack.Screen name="ServiceRequestsScreen" component={ServiceRequestsScreen} />
    <AuthenticatedStack.Screen name="ServiceRequestDetailsScreen" component={ServiceRequestDetailsScreen} />
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

  useEffect(() => {
    async function requestUserPermission() {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Authorization status:', authStatus);
        getToken()
      }
    }
    requestUserPermission()
  }, [])

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });
    return unsubscribe;
  }, []);


  const getToken = async () => {
    let token = await messaging().getToken()
    AsyncStorage.setItem('fcm_token', token);
  }

  useEffect(() => {
    setupInterceptors()
  }, [])

  if (isLoading)
    return (
      <NavigationContainer>
        <VideoLoader videoUrl={require('../assets/brand-video.mp4')} />
      </NavigationContainer>
    )
  if (!user)
    return (
      <NavigationContainer ref={navigationRef}>
        <PublicNavigator />
        {alert && <AlertComponent />}
      </NavigationContainer>
    )
  return (
    <NavigationContainer ref={navigationRef}>
      <Navbar />
      <AuthenticatedNavigator />
      {alert && <AlertComponent />}
    </NavigationContainer>
  );

};


export default AppNavigator;
