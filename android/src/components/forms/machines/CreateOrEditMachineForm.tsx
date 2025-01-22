import React, { useContext, useEffect, useState } from 'react';
import {
    Button,
    TextInput,
    HelperText,
    Text,
    Divider,
} from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation } from 'react-query';
import { AxiosResponse } from 'axios';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Asset, } from 'react-native-image-picker';
import { BackendError } from '../../../..';
import { AlertContext } from '../../../contexts/AlertContext';
import { queryClient } from '../../../App';
import SelectPhotoComponent from '../../SelectPhotoComponent';
import { GetMachineDto } from '../../../dto/MachineDto';
import { CreateOrEditMachine } from '../../../services/MachineService';



function CreateOrEditMachineForm({
    machine,
    setDialog,
}: {
    machine?: GetMachineDto;
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
    const [validated, setValidated] = useState(true)
    const { setAlert } = useContext(AlertContext);
    const [file, setFile] = useState<Asset | null>(null);
    const { mutate, isSuccess, isLoading } = useMutation<
        AxiosResponse<{ message: string }>,
        BackendError,
        { id?: string; body: FormData }
    >(CreateOrEditMachine, {
        onSuccess: () => {
            queryClient.invalidateQueries('machines')
        },
        onError: (error) => {
            error && setAlert({ message: error.response.data.message || '', color: 'error' });
        },
    });

    const formik = useFormik({
        initialValues: {
            name: machine ? machine.name : '',
            model: machine ? machine.model : '',
            photo: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required').max(100),
            model: Yup.string().required('Required'),
        }),
        onSubmit: (values) => {
            let formData = new FormData();
            if (file) {
                formData.append('file', {
                    uri: file.uri,
                    type: file.type,
                    name: file.fileName,
                });
            }
            formData.append('body', JSON.stringify(values));
            if (validated) {
                if (machine) {
                    mutate({ id: machine._id, body: formData });
                } else {
                    mutate({ body: formData });
                }
            }

        },
    });

    useEffect(() => {
        if (isSuccess) {
            setAlert({ message: `success`, color: 'success' });
            setTimeout(() => {
                formik.resetForm();
            }, 3000);
            setDialog(undefined);
        }
    }, [isSuccess]);

    useEffect(() => {
        if (file) {
            if (file.fileSize && file.fileSize > 20 * 1024 * 1024) {
                setAlert({ message: 'Size should be less than 20 MB', color: 'info' });
                setValidated(false)
                return;
            }
            if (
                file.type &&
                !['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
            ) {
                setAlert({
                    message: 'Allowed formats: .jpg, .jpeg, .png, .gif',
                    color: 'info',
                });
                setValidated(false)
                return;
            }
            setFile(file as unknown as File);
            setValidated(true)
        }

    }, [file])

    return (
        <>

            <ScrollView>
                <View style={{ flex: 1, justifyContent: 'center', padding: 10, gap: 10 }}>
                    <Text
                        style={{
                            fontSize: 30,
                            textAlign: 'center',
                            padding: 20,
                            fontWeight: 'bold',
                        }}
                    >
                        Machine
                    </Text>
                    <TextInput
                        label="Enter Model "
                        mode="flat"
                        style={styles.input}
                        value={formik.values.model}
                        onChangeText={formik.handleChange('model')}
                        onBlur={formik.handleBlur('model')}
                        error={formik.touched.model && Boolean(formik.errors.model)}
                    />
                    {formik.touched.model && Boolean(formik.errors.model) && (
                        <HelperText type="error">{formik.errors.model}</HelperText>
                    )}
                    <TextInput
                        label="Enter Name"
                        mode="flat"
                        style={styles.input}
                        value={formik.values.name}
                        onChangeText={formik.handleChange('name')}
                        onBlur={formik.handleBlur('name')}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                    />
                    {formik.touched.name && Boolean(formik.errors.name) && (
                        <HelperText type="error">{formik.errors.name}</HelperText>
                    )}

                    <SelectPhotoComponent photo={machine?.photo} file={file} setFile={setFile} />
                    <Button
                        mode="contained"
                        buttonColor="red"
                        style={{ padding: 5, borderRadius: 10 }}
                        onPress={() => formik.handleSubmit()}
                        loading={isLoading}
                        disabled={isLoading || !validated}
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
        paddingVertical:10,
        fontSize:18,
        backgroundColor: 'white',
    },
    divider: {
        marginVertical: 10,
        height: 1,
        backgroundColor: '#ddd',
    },
    submitButton: {
        backgroundColor: 'red',
        borderRadius: 8,
        paddingVertical: 10,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CreateOrEditMachineForm;
