import React, { useContext, useEffect, useState } from 'react';
import { Image, View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { StackScreenProps } from '@react-navigation/stack';
import { BackendError } from '../..';
import { PublicStackParamList } from '../navigation/AppNavigator';
import { GetUserDto } from '../dtos/UserDto';
import { UserContext } from '../contexts/UserContext';
import { AlertContext } from '../contexts/AlertContext';
import { UserService } from '../services/UserService';

type Props = StackScreenProps<PublicStackParamList, 'LoginScreen'>;

const LoginScreen = ({ navigation }: Props) => {
  const { setUser } = useContext(UserContext);
  const { setAlert } = useContext(AlertContext);
  const { mutate, isLoading } = useMutation<
    AxiosResponse<{ user: GetUserDto; token: string }>,
    BackendError,
    { mobile: string, fcm_token?: string }
  >(new UserService().DirectLogin, {
    onSuccess: (data) => {
      AsyncStorage.setItem('uname', formik.values.mobile);
      if (data.data.user) {
        setUser(data.data.user);
      }
    },
    onError: (error) => {
      if (error) {
        setAlert({ message: error.response?.data?.message || 'An error occurred', color: 'error', type: 'snack' });
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      mobile: '',
      fcm_token: ''
    },
    validationSchema: Yup.object({
      mobile: Yup.string()
        .required('Mobile is required')
        .min(10, 'Mobile must be 10 digits')
        .max(10, 'Mobile must be 10 digits')
        .matches(/^[0-9]+$/, 'Mobile must be a number'),
    }),
    onSubmit: async (values) => {
      mutate(values);
    },
  });

  useEffect(() => {
    const retrieveCredentials = async () => {
      const savedMobile = await AsyncStorage.getItem('uname');
      const fcmToken = await AsyncStorage.getItem('fcm_token');
      if (savedMobile) {
        formik.values.mobile=savedMobile
      }
      if(fcmToken)
        formik.values.fcm_token=fcmToken
    };
    retrieveCredentials();
  }, []);

  const handleMobileChange = (text) => {
    if (text.length <= 10) {
      formik.setFieldValue('mobile', text);
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/img/icon.png')} />
      <Text style={styles.labelText}>Mobile Number</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.countryCode}>+91</Text>
        <TextInput
          style={[
            styles.input,
            formik.touched.mobile && formik.errors.mobile && styles.inputError,
          ]}
          placeholder="Registered Mobile Number"
          value={formik.values.mobile}
          onChangeText={handleMobileChange}
          onBlur={formik.handleBlur('mobile')}
          keyboardType="numeric"
          maxLength={10} // Allow max 10 digits
        />
      </View>
      {formik.touched.mobile && formik.errors.mobile && (
        <Text style={styles.errorText}>{formik.errors.mobile}</Text>
      )}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.disabledButton]}
        onPress={() => formik.handleSubmit()}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('RegisterScreen')}
        disabled={isLoading}
      >
        <Text style={styles.registerButtonText}>REGISTER AS CUSTOMER</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 200,
    height: 50,
    marginBottom: 30,
    alignSelf: 'center',
  },
  labelText: {
    marginBottom: 10,
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  countryCode: {
    padding: 12,
    fontSize: 16,
    color: '#888',
    backgroundColor: '#f2f2f2',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'grey',
  },
  registerButton: {
    backgroundColor: 'lightgrey',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    color: 'black',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
