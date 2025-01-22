import React, { useContext, useEffect, useState } from 'react';
import { Button, TextInput, HelperText, Text, Snackbar, Divider } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { ScrollView, View, StyleSheet } from 'react-native';
import { BackendError } from '../../../..';
import { CreateOrEditCustomerDto, GetCustomerDto } from '../../../dto/CustomerDto';
import { CreateOrEditCustomer } from '../../../services/CustomerService';
import { AlertContext } from '../../../contexts/AlertContext';
import { queryClient } from '../../../App';

function CreateOrEditCustomerForm({ customer, setDialog }: { customer?: GetCustomerDto, setDialog: React.Dispatch<React.SetStateAction<string | undefined>> }) {
  const { setAlert } = useContext(AlertContext)
  const { mutate, isSuccess, isLoading } = useMutation<
    AxiosResponse<{ message: string }>,
    BackendError,
    { id?: string, body: CreateOrEditCustomerDto }
  >(CreateOrEditCustomer, {
    onSuccess: () => {
      queryClient.invalidateQueries('customers')
    },
    onError: (error) => {
      error && setAlert({ message: error.response.data.message || "", color: 'error' })
      //setDialog(undefined)
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
      setAlert({ message: ` Created customer as ${formik.values.name}  successfully`, color: 'success' });
      formik.resetForm()
      setDialog(undefined)
    }
  }, [isSuccess]);
  return (
    <>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>Customer Form</Text>
        <TextInput
          label="Name"
          placeholder="e.g., John Doe"
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
          label="Email"
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
          label="Mobile"
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
          label="Address"
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
            !formik.isValid ? setDialog(undefined) : formik.handleSubmit()
          }}
          loading={isLoading}
          disabled={isLoading}
        >
          {!formik.isValid ? 'Close' : 'Submit'}
        </Button>
      </ScrollView>
    </>
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
    paddingVertical: 10,
    fontSize: 18
  },
  textArea: {
    height: 120,
  },
  divider: {
    marginVertical: 20,
    backgroundColor: '#ddd',
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
  },
  snackbar: {
    backgroundColor: '#323232',
  },
});


export default CreateOrEditCustomerForm;
