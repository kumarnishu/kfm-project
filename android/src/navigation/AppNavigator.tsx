import React, { useContext, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  NavigationContainer, createNavigationContainerRef,
} from '@react-navigation/native';
import { UserContext } from '../contexts/UserContext';
import HomeScreen from '../screens/HomeScreen';
import VideoLoader from '../components/VideoLoader';
import CustomerDetailsScreen from '../screens/details/CustomerDetailsScreen';
import CustomersScreen from '../screens/main/CustomersScreen';
import LoginScreen from '../screens/LoginScreen';
import OtpVerifyScreen from '../screens/OtpVerifyScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MachinesScreen from '../screens/main/MachinesScreen';
import SparesScreen from '../screens/main/SparesScreen';
import ProductsScreen from '../screens/main/ProductsScreen';
import EngineersScreen from '../screens/main/EngineersScreen';
import MachineDetailsScreen from '../screens/details/MachineDetailsScreen';
import SpareDetailsScreen from '../screens/details/SpareDetailsScreen';
import ProductDetailsScreen from '../screens/details/ProductDetailsScreen';
import EngineerDetailsScreen from '../screens/details/EngineerDetailsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import ServiceRequestDetailsScreen from '../screens/details/ServiceRequestDetailsScreen';
import ServiceRequestsScreen from '../screens/main/ServiceRequestsScreen';
import StaffDetailsScreen from '../screens/details/StaffDetailsScreen';
import StaffsScreen from '../screens/main/StaffsScreen';
import { AlertContext } from '../contexts/AlertContext';
import AlertComponent from '../components/AlertComponent';


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
  CustomerDetailsScreen: { id: string }; // Example parameter
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

  if (isLoading)
    return (
      <NavigationContainer>
        <VideoLoader videoUrl={require('../assets/brand-video.mp4')} />
      </NavigationContainer>
    )

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
