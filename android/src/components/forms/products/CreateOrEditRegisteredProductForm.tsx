import React, { useContext, useEffect, useState } from 'react';
import {
    View, Text, TextInput,  StyleSheet,
    TouchableOpacity
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../../..';
import { AlertContext } from '../../../contexts/AlertContext';
import { queryClient } from '../../../App';
import { RegisteredProductService } from "../../../services/RegisteredProductService";
import SelectMachinesComponent from '../../dialogs/picker/SelectMachinesComponent';
import SelectCustomersComponent from '../../dialogs/picker/SelectCustomersComponent';
import { GetRegisteredProductDto, CreateOrEditRegisteredProductDto } from '../../../dtos/RegisteredProducDto';
import DatePickerComponent from '../../dialogs/picker/DatePickerComponent';

function CreateOrEditRegisteredProductForm({
    setDialog,
    product,
}: {
    product?: GetRegisteredProductDto;
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
    const [dialog2, setDialog2] = useState<string>();
    const [isAmcPickerVisible, setAmcPickerVisibility] = useState(false);
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

    const formik = useFormik({
        initialValues: {
            customer: product ? product.customer.id : '',
            sl_no: product ? product.sl_no : 0,
            installationDate: product ? product.installationDate : '',
            warrantyUpto: product ? product.warrantyUpto : '',
            amcUpto: product ? product.amcUpto : '',
            machine: product ? product.machine.id : ''
        },
        validationSchema: Yup.object({
            customer: Yup.string().required('Customer is required'),
            sl_no: Yup.number().required('Serial number is required'),
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
            {/* Serial Number */}
            <Text style={styles.label}>Serial Number</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Serial Number"
                value={String(formik.values.sl_no)}
                onChangeText={formik.handleChange('sl_no')}
                onBlur={formik.handleBlur('sl_no')}
            />
            {formik.touched.sl_no && formik.errors.sl_no && (
                <Text style={styles.errorText}>{formik.errors.sl_no}</Text>
            )}

            {/* Customer */}
            <Text style={styles.label}>Customer</Text>
            <SelectCustomersComponent dialog={dialog2} setDialog={setDialog2} value={formik.values.customer} setValue={(val) => formik.setFieldValue('customer', val)} />
            {formik.touched.customer && formik.errors.customer && (
                <Text style={styles.errorText}>{formik.errors.customer}</Text>
            )}

            {/* Machine */}
            <Text style={styles.label}>Machine</Text>
            <SelectMachinesComponent dialog={dialog2} setDialog={setDialog2} value={formik.values.machine} setValue={(val) => formik.setFieldValue('machine', val)} />
            {formik.touched.machine && formik.errors.machine && (
                <Text style={styles.errorText}>{formik.errors.machine}</Text>
            )}

            {/* Installation Date */}
            <Text style={styles.label}>Installation Date</Text>
            <DatePickerComponent isDisabled={product && product?.installationDate !== ""} visible={isDatePickerVisible} setVisible={setDatePickerVisibility} date={formik.values.installationDate} setDate={(val) => formik.values.installationDate = val} />
            {formik.touched.installationDate && formik.errors.installationDate && (
                <Text style={styles.errorText}>{formik.errors.installationDate}</Text>
            )}
            {/* Warranty Upto */}
            <Text style={styles.label}>Warranty Upto</Text>
            <DatePickerComponent visible={isWarrantyPickerVisible} setVisible={setWarrantyPickerVisibility} date={formik.values.warrantyUpto} setDate={(val) => formik.values.warrantyUpto = val} />
            {formik.touched.warrantyUpto && formik.errors.warrantyUpto && (
                <Text style={styles.errorText}>{formik.errors.warrantyUpto}</Text>
            )}

            {/* AMC Upto */}
            <Text style={styles.label}>AMC Upto</Text>
            <DatePickerComponent visible={isAmcPickerVisible} setVisible={setAmcPickerVisibility} date={formik.values.amcUpto} setDate={(val) => formik.values.amcUpto = val} />
            {formik.touched.amcUpto && formik.errors.amcUpto && (
                <Text style={styles.errorText}>{formik.errors.amcUpto}</Text>
            )}
            {/* Submit Button */}
            <TouchableOpacity
                style={styles.submitButton}
                onPress={() => formik.handleSubmit()}
                disabled={isLoading}
            >
                <Text style={styles.submitButtonText}>{product ? "Edit Product" : "New Product"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 50,
        gap: 10,
    },
    title: {
        fontSize: 30,
        textAlign: 'center',
        padding: 20,
        fontWeight: 'bold',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
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
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 15
    },
    submitButtonText: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center'
    }
});

export default CreateOrEditRegisteredProductForm;
