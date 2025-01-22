import React, { useContext, useEffect, useState } from 'react';
import {
  Image,
  View,
} from 'react-native';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { TextInput, Button, Text, Divider, Snackbar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { StackScreenProps } from '@react-navigation/stack';
import { BackendError } from '../..';
import { PublicStackParamList } from '../navigation/AppNavigator';
import { SendOtp } from '../services/UserService';
import { GetUserDto } from '../dto/UserDto';
import { UserContext } from '../contexts/UserContext';
import { AlertContext } from '../contexts/AlertContext';



type Props = StackScreenProps<PublicStackParamList, 'LoginScreen'>;

const LoginScreen = ({ navigation }: Props) => {
  const { setUser } = useContext(UserContext)
  const { setAlert } = useContext(AlertContext)
  const { mutate, isSuccess, isLoading, error } = useMutation<
    AxiosResponse<{ user: GetUserDto; token: string }>,
    BackendError,
    { mobile: string }
  >(SendOtp, {
    onSuccess: (() => {
      AsyncStorage.setItem('uname', formik.values.mobile);
      navigation.replace("OtpVerifyScreen", { mobile: formik.values.mobile })
    }),
    onError: ((error) => {
      error && setAlert({ message: error.response.data.message || "", color: 'error', type: 'snack' })
    })
  });

  const formik = useFormik({
    initialValues: {
      mobile: '',
    },
    validationSchema: Yup.object({
      mobile: Yup.string().required('mobile is required').min(10, 'mobile must be 10 digits').max(10, 'mobile must be 10 digits').matches(/^[0-9]+$/, 'mobile must be a number'),
    }),
    onSubmit: async (values) => {
      mutate(values);
    },
  });

  useEffect(() => {
    const retrieveCredentials = async () => {
      const savedmobile = await AsyncStorage.getItem('uname');
      if (savedmobile) {
        formik.setValues({ mobile: savedmobile });
      }
    };
    retrieveCredentials();
  }, []);


  return (
    <>

      <View style={{ flex: 1, padding: 10, flexDirection: 'column', gap: 15, justifyContent: 'center', backgroundColor: 'white' }}>
        <Image style={{ width: 200, height: 50, marginLeft: -15 }} source={require('../assets/img/icon.png')} />
        <TextInput
          label="Mobile"
          autoFocus
          contentStyle={{ fontSize: 20 }}
          placeholder="Registered Mobile Number"
          value={formik.values.mobile}
          onChangeText={formik.handleChange('mobile')}
          onBlur={formik.handleBlur('mobile')}
          keyboardType='numeric'
          mode="flat"
          style={{ backgroundColor: 'white', paddingVertical: 10, fontSize: 20 }}
          error={formik.touched.mobile && !!formik.errors.mobile}
        />
        <Button
          mode="contained"
          onPress={() => formik.handleSubmit()}
          loading={isLoading}
          buttonColor='red'
          style={{ padding: 5, paddingHorizontal: 20, borderRadius: 10 }}
        >
          LOGIN
        </Button>


        <Button
          mode="contained"
          disabled={isLoading}
          onPress={() => navigation.navigate("RegisterScreen")}
          labelStyle={{ color: 'black', textAlign: 'center', fontSize: 14, paddingVertical: 5 }}
          buttonColor='lightgrey'
          style={{ position: 'absolute', bottom: 20, margin: 10, width: '100%', borderRadius: 5 }}
        >
          REGISTER AS CUSTOMER
        </Button>
      </View >
    </>
  );
};


export default LoginScreen;