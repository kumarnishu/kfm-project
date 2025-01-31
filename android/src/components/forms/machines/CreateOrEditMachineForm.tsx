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
import { queryClient } from '../../../App';
import { GetMachineDto } from "../../../dtos/MachineDto"
import { MachineService } from "../../../services/MachineService"
import SelectPhotoComponent from "../../common/SelectPhotoComponent"

function CreateOrEditMachineForm({
    machine,
    setDialog,
}: {
    machine?: GetMachineDto;
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
    const [validated, setValidated] = useState(true);
    const { setAlert } = useContext(AlertContext);
    const [file, setFile] = useState<Asset | null>(null);
    const { mutate, isSuccess, isLoading } = useMutation<
        AxiosResponse<{ message: string }>,
        BackendError,
        { id?: string; body: FormData }
    >(new MachineService().CreateOrEditMachine, {
        onSuccess: () => {
            queryClient.invalidateQueries('machines');
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
                //@ts-ignore
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
                setValidated(false);
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
                setValidated(false);
                return;
            }
            setFile(file as unknown as File);
            setValidated(true);
        }
    }, [file]);

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.headerText}>Machine</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Model"
                    value={formik.values.model}
                    onChangeText={formik.handleChange('model')}
                    onBlur={formik.handleBlur('model')}
                />
                {formik.touched.model && formik.errors.model && (
                    <Text style={styles.errorText}>{formik.errors.model}</Text>
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Enter Name"
                    value={formik.values.name}
                    onChangeText={formik.handleChange('name')}
                    onBlur={formik.handleBlur('name')}
                />
                {formik.touched.name && formik.errors.name && (
                    <Text style={styles.errorText}>{formik.errors.name}</Text>
                )}
                <SelectPhotoComponent photo={machine?.photo} file={file} setFile={setFile} />
                <Button
                    title="Submit"
                    onPress={() => formik.handleSubmit()}
                    disabled={isLoading || !validated}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    headerText: {
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
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default CreateOrEditMachineForm;
