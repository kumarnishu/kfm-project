import React, { useContext, useEffect, useState } from 'react';
import { Button, TextInput, HelperText, Text, Snackbar, Divider } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { ScrollView, StyleSheet, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { BackendError } from '../..';
import { PublicStackParamList } from '../navigation/AppNavigator';
import { CreateOrEditCustomerDto } from '../dto/CustomerDto';
import { AlertContext } from '../contexts/AlertContext';
import { Signup } from '../services/UserService';

type Props = StackScreenProps<PublicStackParamList, 'RegisterScreen'>;


function RegisterScreen({ navigation }: Props) {
  const { setAlert } = useContext(AlertContext)
  const { mutate, isSuccess, isLoading } = useMutation<
    AxiosResponse<{ message: string }>,
    BackendError,
    { body: CreateOrEditCustomerDto }
  >(Signup, {
    onSuccess: (() => {
      setAlert({ message: `${formik.values.name} ThankYou for joining With us !!`, color: 'success', type: 'snack' })
      navigation.navigate('LoginScreen')
    }),
    onError: ((error) => {
      error && setAlert({
        message: error.response.data.message || "", color: 'error', type
          : 'snack'
      })
    })
  });


  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      mobile: "",
      address: "",

    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required').min(2).max(100),
      username: Yup.string().required('Required').min(2).max(100),
      email: Yup.string().required('Required').email('Invalid email'),
      address: Yup.string().required('Required Address').min(4).max(300),
      mobile: Yup.string().required('mobile is required').min(10, 'mobile must be 10 digits').max(10, 'mobile must be 10 digits').matches(/^[0-9]+$/, 'mobile must be a number'),
    }),
    onSubmit: (values) => {
      mutate({ body: values });
    },
  });

  return (
    <>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>Register Here</Text>
        <TextInput
          label="Company Name"
          placeholder="e.g., KFM INDIA"
          mode="flat"
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
          error={formik.touched.name && !!formik.errors.name}
          style={styles.input}

        />
        {formik.touched.name && formik.errors.name && (
          <HelperText type="error">{formik.errors.name}</HelperText>
        )}
        <TextInput
          label="User Name"
          placeholder="e.g., Rahul"
          mode="flat"
          value={formik.values.username}
          onChangeText={formik.handleChange('username')}
          onBlur={formik.handleBlur('username')}
          error={formik.touched.username && !!formik.errors.username}
          style={styles.input}

        />
        {formik.touched.username && formik.errors.username && (
          <HelperText type="error">{formik.errors.username}</HelperText>
        )}

        <TextInput
          label="Email Address"
          placeholder="e.g., john.doe@example.com"
          mode="flat"
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          error={formik.touched.email && !!formik.errors.email}
          style={styles.input}

        />
        {formik.touched.email && formik.errors.email && (
          <HelperText type="error">{formik.errors.email}</HelperText>
        )}

        <TextInput
          label="Mobile Number"
          mode="flat"
          keyboardType="number-pad"
          value={formik.values.mobile}
          onChangeText={formik.handleChange('mobile')}
          onBlur={formik.handleBlur('mobile')}
          error={formik.touched.mobile && !!formik.errors.mobile}
          style={styles.input}
          placeholder="e.g., 1234567890"
        />
        {formik.touched.mobile && formik.errors.mobile && (
          <HelperText type="error">{formik.errors.mobile}</HelperText>
        )}

        <TextInput
          label="Company Address"
          mode="flat"
          placeholder='e.g., Bahadurgarh haryana'
          multiline
          numberOfLines={4}
          value={formik.values.address}
          onChangeText={formik.handleChange('address')}
          onBlur={formik.handleBlur('address')}
          error={formik.touched.address && !!formik.errors.address}
          style={[styles.input, styles.textArea]}
        />
        {formik.touched.address && formik.errors.address && (
          <HelperText type="error">{formik.errors.address}</HelperText>
        )}

        <Button
          mode="contained"
          buttonColor="red"
          style={styles.button}
          onPress={() => {
            formik.isValid && formik.handleSubmit()
          }}
          loading={isLoading}
          disabled={isLoading}
        >
          {!formik.isValid ? 'Close' : 'Register'}
        </Button>
      </ScrollView>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    marginBottom: 10,
    padding: 5,
    backgroundColor: 'white'
  },
  textArea: {
    height: 120,
  },
  divider: {
    marginVertical: 20,
    backgroundColor: '#ddd',
  },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
  },
  snackbar: {
    backgroundColor: '#323232',
  },
});



export default RegisterScreen;