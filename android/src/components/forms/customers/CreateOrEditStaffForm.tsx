import React, { useContext, useEffect, useState } from 'react';
import { TextInput, Button, ScrollView, StyleSheet, View, Text, Alert } from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../../..';
import { AlertContext } from '../../../contexts/AlertContext';
import { CreateOrEditUserDto, GetUserDto } from '../../../dtos/UserDto';
import { CustomerService } from '../../../services/CustomerService';


function CreateOrEditStaffForm({ customer, staff, setDialog }: { customer: string, staff?: GetUserDto, setDialog: React.Dispatch<React.SetStateAction<string | undefined>> }) {
    const { setAlert } = useContext(AlertContext);
    const { mutate, isSuccess, isLoading } = useMutation<
        AxiosResponse<{ message: string }>,
        BackendError,
        { id?: string, body: CreateOrEditUserDto }
    >(new CustomerService().CreateOrEditStaff, {
        onError: (error) => {
            error && setAlert({ message: error.response.data.message || "", color: 'error' });
        }
    });

    const formik = useFormik({
        initialValues: {
            customer: customer,
            email: staff ? staff.email : "",
            mobile: staff ? staff.mobile : "",
            username: staff ? staff.username : "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required').min(4).max(100),
            customer: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email'),
            mobile: Yup.string().required('mobile is required').min(10, 'mobile must be 10 digits').max(10, 'mobile must be 10 digits').matches(/^[0-9]+$/, 'mobile must be a number'),
        }),
        onSubmit: (values) => {
            if (staff) {
                mutate({ id: staff._id, body: values });
            }
            else {
                mutate({ id: customer, body: values });
            }
        },
    });

    useEffect(() => {
        if (isSuccess) {
            setDialog(undefined);
            setTimeout(() => {
                formik.resetForm();
            }, 3000);
        }
    }, [isSuccess]);

    return (
        <>
            <ScrollView>
                <View style={{ flex: 1, justifyContent: 'center', padding: 10, gap: 2 }}>
                    <Text style={{ fontSize: 30, textAlign: 'center', padding: 20, fontWeight: 'bold' }}>Staff</Text>
                    <TextInput
                        placeholder="Enter your name"
                        style={styles.input}
                        value={formik.values.username}
                        onChangeText={formik.handleChange('username')}
                        onBlur={formik.handleBlur('username')}
                    />
                    {formik.touched.username && Boolean(formik.errors.username) && <Text style={styles.errorText}>{formik.errors.username}</Text>}

                    <TextInput
                        placeholder="Enter your email"
                        style={styles.input}
                        value={formik.values.email}
                        onChangeText={formik.handleChange('email')}
                        onBlur={formik.handleBlur('email')}
                    />
                    {formik.touched.email && Boolean(formik.errors.email) && <Text style={styles.errorText}>{formik.errors.email}</Text>}

                    <TextInput
                        placeholder="Enter your mobile"
                        style={styles.input}
                        keyboardType="number-pad"
                        value={formik.values.mobile}
                        onChangeText={formik.handleChange('mobile')}
                        onBlur={formik.handleBlur('mobile')}
                    />
                    {formik.touched.mobile && Boolean(formik.errors.mobile) && <Text style={styles.errorText}>{formik.errors.mobile}</Text>}
                    <Button
                        title="Submit"
                        color='red'
                        onPress={() => formik.handleSubmit()}
                        disabled={isLoading}
                    />
                </View>
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
        fontSize: 18,
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
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default CreateOrEditStaffForm;
