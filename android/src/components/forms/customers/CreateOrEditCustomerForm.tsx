import React, { useContext, useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, ScrollView, StyleSheet
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../../..';
import { AlertContext } from '../../../contexts/AlertContext';
import { queryClient } from '../../../App';
import { CreateOrEditCustomerDto, GetCustomerDto } from '../../../dtos/CustomerDto';
import { CustomerService } from "../../../services/CustomerService"

function CreateOrEditCustomerForm({ customer, setDialog }: { customer?: GetCustomerDto, setDialog: React.Dispatch<React.SetStateAction<string | undefined>> }) {
  const { setAlert } = useContext(AlertContext);
  const { mutate, isSuccess, isLoading } = useMutation<
    AxiosResponse<{ message: string }>,
    BackendError,
    { id?: string, body: CreateOrEditCustomerDto }
  >(new CustomerService().CreateOrEditCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries('customers');
    },
    onError: (error) => {
      error && setAlert({ message: error.response.data.message || "", color: 'error' });
    }
  });

  const formik = useFormik({
    initialValues: {
      name: customer ? customer.name : "shdsd",
      email: customer ? customer.email : "abc@gm.com",
      mobile: customer ? customer.mobile : "7056943283",
      address: customer ? customer.address : "bahdurgarh",
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required').min(4).max(100),
      email: Yup.string().required('Required').email('Invalid email'),
      address: Yup.string().required('Required Address').min(4).max(300),
      mobile: Yup.string()
        .required('Mobile is required')
        .min(10, 'Mobile must be 10 digits')
        .max(10, 'Mobile must be 10 digits')
        .matches(/^[0-9]+$/, 'Mobile must be a number'),
    }),
    onSubmit: (values) => {
      if (customer)
        mutate({ id: customer?._id, body: values });
      else
        mutate({ body: values });
    },
  });

  useEffect(() => {
    if (isSuccess) {
      setAlert({ message: `Created customer as ${formik.values.name} successfully`, color: 'success' });
      formik.resetForm();
      setDialog(undefined);
    }
  }, [isSuccess]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Customer Form</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formik.values.name}
        onChangeText={formik.handleChange('name')}
        onBlur={formik.handleBlur('name')}
      />
      {formik.touched.name && formik.errors.name && (
        <Text style={styles.errorText}>{formik.errors.name}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formik.values.email}
        onChangeText={formik.handleChange('email')}
        onBlur={formik.handleBlur('email')}
      />
      {formik.touched.email && formik.errors.email && (
        <Text style={styles.errorText}>{formik.errors.email}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Mobile"
        keyboardType="number-pad"
        value={formik.values.mobile}
        onChangeText={formik.handleChange('mobile')}
        onBlur={formik.handleBlur('mobile')}
      />
      {formik.touched.mobile && formik.errors.mobile && (
        <Text style={styles.errorText}>{formik.errors.mobile}</Text>
      )}

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Address"
        multiline
        numberOfLines={4}
        value={formik.values.address}
        onChangeText={formik.handleChange('address')}
        onBlur={formik.handleBlur('address')}
      />
      {formik.touched.address && formik.errors.address && (
        <Text style={styles.errorText}>{formik.errors.address}</Text>
      )}

      <Button
        title={!formik.isValid ? 'Close' : 'Submit'}
        onPress={() => {
          !formik.isValid ? setDialog(undefined) : formik.handleSubmit();
        }}
        disabled={isLoading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    fontSize: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  textArea: {
    height: 120,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
});

export default CreateOrEditCustomerForm;
