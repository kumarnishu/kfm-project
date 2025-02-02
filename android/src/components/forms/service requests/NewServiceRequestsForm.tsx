import React, { useContext, useEffect, useState } from 'react';
import {
    View, Text, TextInput, Button, ScrollView, StyleSheet
} from 'react-native';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { Asset } from 'react-native-image-picker';
import { BackendError } from '../../../..';
import { AlertContext } from '../../../contexts/AlertContext';
import { ServiceRequestService } from '../../../services/ServiceRequestService';
import SelectMediaComponent from '../../../components/common/SelectMediaComponent';
import { GetRegisteredProductDto } from '../../../dtos/RegisteredProducDto';
import { DropDownDto } from '../../../dtos/DropDownDto';

function NewServiceRequestsForm({
    product,
    setDialog,
    type

}: {
    product: GetRegisteredProductDto; type: DropDownDto;
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
    const { setAlert } = useContext(AlertContext);
    const [validationMessage, setValidationMessage] = useState("")
    const [files, setFiles] = useState<{ asset: Asset | null, id: number }[]>([]);
    const [validated, setValidated] = useState(false)
    const { mutate, isSuccess, isLoading } = useMutation<
        AxiosResponse<{ message: string }>,
        BackendError,
        { body: FormData }
    >(new ServiceRequestService().CreateServiceRequest, {
        onError: (error) => {
            error && setAlert({ message: error.response.data.message || '', color: 'error' });
        },
    });

    const formik = useFormik({
        initialValues: {
            problem: '',
            product: product._id,
        },
        validationSchema: Yup.object({
            problem: Yup.string().required('Required').max(1000),
            product: Yup.string().required()
        }),
        onSubmit: (values) => {
            let formData = new FormData();
            if (files && files.length > 0) {
                //@ts-ignore
                files.forEach((file) => formData.append('files', {
                    uri: file.asset?.uri,
                    type: file.asset?.type,
                    name: file.asset?.fileName,
                }));
            }
            let data = {
                problem: values.problem,
                product: values.product
            }
            formData.append('body', JSON.stringify(data));
            mutate({ body: formData });
        },
    });

    useEffect(() => {
        if (type.id == "service") {
            setValidationMessage("Your Warranty Expired. So You could not proceed further")
            setValidated(false)
        }
        else {
            setValidated(true)
        }
    }, [type])

    useEffect(() => {
        if (isSuccess) {
            setAlert({ message: `Successfully created a service request`, color: 'success' });
            setTimeout(() => {
                formik.resetForm();
            }, 3000);
            setDialog(undefined);
        }
    }, [isSuccess]);

    return (
        <ScrollView>
            {validated ? <View style={styles.container}>
                <Text style={styles.headerText}>{type.label}</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Describe Problem"
                    multiline
                    numberOfLines={4}
                    value={formik.values.problem}
                    onChangeText={formik.handleChange('problem')}
                    onBlur={formik.handleBlur('problem')}
                />
                {formik.touched.problem && formik.errors.problem && (
                    <Text style={styles.errorText}>{formik.errors.problem}</Text>
                )}
                <SelectMediaComponent files={files} setFiles={setFiles} />
                <Button
                    title="Submit"
                    onPress={() => formik.handleSubmit()}
                    disabled={isLoading}
                />
            </View> :
                <View style={{ flex: 1, height: '100%', justifyContent: 'center' }}>
                    <Text style={{ color: 'red', fontSize: 16 }}>{validationMessage}</Text>
                </View>}
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
        fontSize: 30,
        textAlign: 'center',
        padding: 20,
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: 'white',
        paddingVertical: 10,
        paddingHorizontal: 8,
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
});

export default NewServiceRequestsForm;
