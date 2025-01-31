import React, { useContext, useEffect, useState } from 'react';
import {
    View, Text, TextInput, Button, Pressable, StyleSheet
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useMutation, useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { Picker } from '@react-native-picker/picker';
import { BackendError } from '../../../..';
import { AlertContext } from '../../../contexts/AlertContext';
import moment from 'moment';
import { queryClient } from '../../../App';
import { } from "../../../dtos/ServiceRequestDto"
import { RegisteredProductService } from "../../../services/RegisteredProductService"
import { CreateOrEditRegisteredProductDto, GetRegisteredProductDto } from '../../../dtos/RegisteredProducDto';
import { CustomerService } from "../../../services/CustomerService"
import { DropDownDto } from '../../../dtos/DropDownDto';
import { MachineService } from '../../../services/MachineService';



function CreateOrEditRegisteredProductForm({
    setDialog,
    product,
}: {
    product?: GetRegisteredProductDto;
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isWarrantyPickerVisible, setWarrantyPickerVisibility] = useState(false);
    const { setAlert } = useContext(AlertContext);
    const { mutate, isSuccess, isLoading } = useMutation<
        AxiosResponse<{ message: string }>,
        BackendError,
        { id?: string; body: CreateOrEditRegisteredProductDto }
    >(new RegisteredProductService().CreateOrEditRegisteredProduct, {
        onError: (error) => {
            error &&
                setAlert({
                    message: error.response?.data?.message || 'An error occurred',
                    color: 'error',
                });
        },
    });

    // Fetch dropdown data
    const { data: customersData } = useQuery<
        AxiosResponse<DropDownDto[]>,
        BackendError
    >('customers', new CustomerService().GetAllCustomersForDropDown);
    const { data: machinesData } = useQuery<
        AxiosResponse<DropDownDto[]>,
        BackendError
    >('machines', new MachineService().GetAllMachinesDropdown);

    const formik = useFormik({
        initialValues: {
            customer: product ? product.customer.id : '',
            sl_no: product ? product.sl_no :0,
            installationDate: product ? moment(product.installationDate).format("DD/MM/YYYY") : '',
            warrantyUpto: product ? moment(product.warrantyUpto).format("DD/MM/YYYY") : '',
            machine: product ? product.machine.id : ''
        },
        validationSchema: Yup.object({
            customer: Yup.string().required('Customer is required'),
            sl_no: Yup.string().required('Serial number is required'),
            machine: Yup.string().required('Machine type is required'),
        }),
        onSubmit: (values) => {
            if (product) {
                mutate({ id: product._id, body: values });
            } else {
                mutate({ body: values });
            }
        },
    });

    useEffect(() => {
        if (isSuccess) {
            setAlert({ message: 'Successfully saved', color: 'success' });
            setDialog(undefined);
            queryClient.invalidateQueries('products');
        }
    }, [isSuccess]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registered Product</Text>

            {/* Serial Number */}
            <TextInput
                style={styles.input}
                placeholder="Enter Serial Number"
                value={formik.values.sl_no.toString()}
                onChangeText={formik.handleChange('sl_no')}
                onBlur={formik.handleBlur('sl_no')}
            />
            {formik.touched.sl_no && formik.errors.sl_no && (
                <Text style={styles.errorText}>{formik.errors.sl_no}</Text>
            )}

            {/* Customer Picker */}
            <Picker
                selectedValue={formik.values.customer}
                onValueChange={formik.handleChange('customer')}
                style={styles.picker}
            >
                <Picker.Item label="Select Customer" value="" />
                {customersData && customersData.data.map((item, index) => (
                    <Picker.Item key={index} label={item.label} value={item.id} />
                ))}
            </Picker>
            {formik.touched.customer && formik.errors.customer && (
                <Text style={styles.errorText}>{formik.errors.customer}</Text>
            )}

            {/* Machine Picker */}
            <Picker
                selectedValue={formik.values.machine}
                onValueChange={formik.handleChange('machine')}
                style={styles.picker}
            >
                <Picker.Item label="Select Machine" value="" />
                {machinesData && machinesData.data.map((item, index) => (
                    <Picker.Item key={index} label={item.label} value={item.id} />
                ))}
            </Picker>
            {formik.touched.machine && formik.errors.machine && (
                <Text style={styles.errorText}>{formik.errors.machine}</Text>
            )}

            {/* Installation Date */}
            <Pressable onPress={() => setDatePickerVisibility(true)}>
                <TextInput
                    style={styles.input}
                    placeholder="Installation Date"
                    value={formik.values.installationDate}
                    onBlur={formik.handleBlur('installationDate')}
                    editable={false}
                />
            </Pressable>
            {formik.touched.installationDate && formik.errors.installationDate && (
                <Text style={styles.errorText}>{formik.errors.installationDate}</Text>
            )}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={(date) => {
                    formik.setFieldValue('installationDate', moment(date).format("DD/MM/YYYY"));
                    setDatePickerVisibility(false);
                }}
                onCancel={() => setDatePickerVisibility(false)}
            />

            {/* Warranty Upto */}
            <Pressable onPress={() => setWarrantyPickerVisibility(true)}>
                <TextInput
                    style={styles.input}
                    placeholder="Warranty Upto"
                    value={formik.values.warrantyUpto}
                    onBlur={formik.handleBlur('warrantyUpto')}
                    editable={false}
                />
            </Pressable>
            {formik.touched.warrantyUpto && formik.errors.warrantyUpto && (
                <Text style={styles.errorText}>{formik.errors.warrantyUpto}</Text>
            )}
            <DateTimePickerModal
                isVisible={isWarrantyPickerVisible}
                mode="date"
                onConfirm={(date) => {
                    formik.setFieldValue('warrantyUpto', moment(date).format("DD/MM/YYYY"));
                    setWarrantyPickerVisibility(false);
                }}
                onCancel={() => setWarrantyPickerVisibility(false)}
            />

            <View style={styles.divider} />

            {/* Submit Button */}
            <Button
                title="Submit"
                onPress={() => formik.handleSubmit()}
                disabled={isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        padding: 20,
        fontWeight: 'bold',
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
    picker: {
        height: 50,
        backgroundColor: 'white',
        borderRadius: 4,
        marginBottom: 15,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    checkboxLabel: {
        marginLeft: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default CreateOrEditRegisteredProductForm;
