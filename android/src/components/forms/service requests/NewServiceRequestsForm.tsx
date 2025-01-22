import React, { useContext, useEffect, useState } from 'react';
import {
    Button,
    TextInput,
    HelperText,
    Text,
} from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { ScrollView, View, Image, StyleSheet } from 'react-native';
import { BackendError } from '../../../..';
import { AlertContext } from '../../../contexts/AlertContext';
import { Asset } from 'react-native-image-picker';
import { CreateServiceRequest } from '../../../services/ServiceRequestService';
import SelectMediaComponent from '../../SelectMediaComponent';
import { GetRegisteredProductDto } from '../../../dto/RegisteredProducDto';

function NewServiceRequestsForm({
    product,
    setDialog,
}: {
    product: GetRegisteredProductDto;
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
    const { setAlert } = useContext(AlertContext);
    const [files, setFiles] = useState<{ asset: Asset | null, id: number }[]>([]);

    const { mutate, isSuccess, isLoading } = useMutation<
        AxiosResponse<{ message: string }>,
        BackendError,
        { body: FormData }
    >(CreateServiceRequest, {
        onError: (error) => {
            error && setAlert({ message: error.response.data.message || '', color: 'error' });
        },
    });

    const formik = useFormik({
        initialValues: {
            problem: '',
            product: product._id,
            media: '',
        },
        validationSchema: Yup.object({
            problem: Yup.string().required('Required').max(100),
            product: Yup.string().required()
        }),
        onSubmit: (values) => {
            let formData = new FormData();
            if (files && files.length > 0) {
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
        if (isSuccess) {
            setAlert({ message: `Successfully created a service request`, color: 'success' });
            setTimeout(() => {
                formik.resetForm();
            }, 3000);
            setDialog(undefined);
        }
    }, [isSuccess]);



    return (
        <>

            <ScrollView>
                <View style={{ flex: 1, justifyContent: 'center', padding: 10, gap: 2 }}>
                    <Text
                        style={{
                            fontSize: 30,
                            textAlign: 'center',
                            padding: 20,
                            fontWeight: 'bold',
                        }}
                    >
                        Service Request
                    </Text>
                    <TextInput
                        label="Describe Problem"
                        mode="flat"
                        multiline
                        numberOfLines={4}
                        value={formik.values.problem}
                        onChangeText={formik.handleChange('problem')}
                        onBlur={formik.handleBlur('problem')}
                        error={formik.touched.problem && !!formik.errors.problem}
                        style={[styles.input, styles.textArea]}
                    />

                    {formik.touched.problem && Boolean(formik.errors.problem) && (
                        <HelperText type="error">{formik.errors.problem}</HelperText>
                    )}
                    <SelectMediaComponent files={files} setFiles={setFiles} />
                    <Button
                        mode="contained"
                        buttonColor="red"
                        style={{ padding: 5, borderRadius: 10 }}
                        onPress={() => formik.handleSubmit()}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Submit
                    </Button>
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


export default NewServiceRequestsForm;
