import React, { useContext } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { StackScreenProps } from '@react-navigation/stack';
import { BackendError } from '../..';
import { PublicStackParamList } from '../navigation/AppNavigator';
import { CreateOrEditCustomerDto } from '../dtos/CustomerDto';
import { AlertContext } from '../contexts/AlertContext';
import { UserService } from '../services/UserService';

type Props = StackScreenProps<PublicStackParamList, 'RegisterScreen'>;

function RegisterScreen({ navigation }: Props) {
  const { setAlert } = useContext(AlertContext);

  const { mutate, isSuccess, isLoading } = useMutation<
    AxiosResponse<{ message: string }>,
    BackendError,
    { body: CreateOrEditCustomerDto }
  >(new UserService().Signup, {
    onSuccess: () => {
      setAlert({ message: `${formik.values.name}, thank you for joining us!`, type: 'alert', color: 'success'});
      navigation.navigate('LoginScreen');
    },
    onError: (error) => {
      Alert.alert('Error', error.response?.data?.message || 'An unknown error occurred.');
    },
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      username: '',
      email: '',
      mobile: '',
      address: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required').min(2).max(100),
      username: Yup.string().required('Required').min(2).max(100),
      email: Yup.string().required('Required').email('Invalid email'),
      address: Yup.string().required('Required').min(4).max(300),
      mobile: Yup.string()
        .required('Mobile is required')
        .min(10, 'Mobile must be 10 digits')
        .max(10, 'Mobile must be 10 digits')
        .matches(/^[0-9]+$/, 'Mobile must be a number'),
    }),
    onSubmit: (values) => {
      mutate({ body: values });
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Register Here</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Company Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., KFM INDIA"
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
        />
        {formik.touched.name && formik.errors.name && <Text style={styles.errorText}>{formik.errors.name}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>User Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Rahul"
          value={formik.values.username}
          onChangeText={formik.handleChange('username')}
          onBlur={formik.handleBlur('username')}
        />
        {formik.touched.username && formik.errors.username && <Text style={styles.errorText}>{formik.errors.username}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., john.doe@example.com"
          value={formik.values.email}
          onChangeText={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          keyboardType="email-address"
        />
        {formik.touched.email && formik.errors.email && <Text style={styles.errorText}>{formik.errors.email}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Mobile Number</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 1234567890"
          value={formik.values.mobile}
          onChangeText={formik.handleChange('mobile')}
          onBlur={formik.handleBlur('mobile')}
          keyboardType="number-pad"
        />
        {formik.touched.mobile && formik.errors.mobile && <Text style={styles.errorText}>{formik.errors.mobile}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Company Address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="e.g., Bahadurgarh, Haryana"
          value={formik.values.address}
          onChangeText={formik.handleChange('address')}
          onBlur={formik.handleBlur('address')}
          multiline
        />
        {formik.touched.address && formik.errors.address && <Text style={styles.errorText}>{formik.errors.address}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.button, (!formik.isValid || isLoading) && styles.disabledButton]}
        onPress={() => formik.isValid && formik.handleSubmit()}
        disabled={!formik.isValid || isLoading}
      >
        <Text style={styles.buttonText}>{!formik.isValid ? 'Close' : isLoading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
