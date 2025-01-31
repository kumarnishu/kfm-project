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
import { CreateOrEditUserDto, GetUserDto } from '../../../dtos/UserDto';
import { EngineerServices } from "../../../services/EngineerServices"
function CreateOrEditEngineerForm({ customer, setDialog, staff }: { customer: string, staff?: GetUserDto, setDialog: React.Dispatch<React.SetStateAction<string | undefined>> }) {
    const { alert, setAlert } = useContext(AlertContext)
    const { mutate, isLoading } = useMutation<
        AxiosResponse<{ message: string }>,
        BackendError,
        { id?: string, body: CreateOrEditUserDto }
    >(new EngineerServices().CreateOrEditEngineer, {
        onSuccess: () => {
            setAlert({ message: "Success!", type: 'snack', color: 'success' });
            setDialog(undefined);
            queryClient.invalidateQueries('engineers');
        },
        onError: (error) => {
            setAlert({ message: error?.response?.data?.message || "An error occurred.", type: 'snack', color: 'error' });
        },
    });

    const formik = useFormik({
        initialValues: {
            customer: customer,
            email: staff?.email || "",
            mobile: staff?.mobile || "",
            username: staff?.username || "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required').min(4).max(100),
            customer: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email'),
            mobile: Yup.string()
                .required('Mobile is required')
                .matches(/^[0-9]{10}$/, 'Mobile must be a 10-digit number'),
        }),
        onSubmit: (values) => {
            if (staff)
                mutate({ id: staff._id, body: values });
            else
                mutate({ body: values });
        },
    });

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.headerText}>{staff ? "Edit Engineer" : "New Engineer"}</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Enter your name"
                        value={formik.values.username}
                        onChangeText={formik.handleChange('username')}
                        onBlur={formik.handleBlur('username')}
                    />
                    {formik.touched.username && formik.errors.username && (
                        <Text style={styles.errorText}>{formik.errors.username}</Text>
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        value={formik.values.email}
                        onChangeText={formik.handleChange('email')}
                        onBlur={formik.handleBlur('email')}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <Text style={styles.errorText}>{formik.errors.email}</Text>
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="Enter your mobile"
                        keyboardType="number-pad"
                        value={formik.values.mobile}
                        onChangeText={formik.handleChange('mobile')}
                        onBlur={formik.handleBlur('mobile')}
                    />
                    {formik.touched.mobile && formik.errors.mobile && (
                        <Text style={styles.errorText}>{formik.errors.mobile}</Text>
                    )}

                    <Button
                        title="Submit"
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
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
        padding: 10,
        fontSize: 18,
        backgroundColor: 'white',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default CreateOrEditEngineerForm;
