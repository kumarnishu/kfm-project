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
import { SparePartService } from '../../../services/SparePartService';
import { AlertContext } from '../../../contexts/AlertContext';
import { queryClient } from '../../../App';
import SelectPhotoComponent from '../../../components/common/SelectPhotoComponent';
import { GetSparePartDto } from '../../../dtos/SparePartDto';

function CreateOrEditSparePartForm({
  part,
  setDialog,
}: {
  part?: GetSparePartDto;
  setDialog: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const [validated, setValidated] = useState(true);
  const { setAlert } = useContext(AlertContext);
  const [file, setFile] = useState<Asset | null>(null);
  const { mutate, isSuccess, isLoading } = useMutation<
    AxiosResponse<{ message: string }>,
    BackendError,
    { id?: string; body: FormData }
  >(new SparePartService().CreateOrEditSparePart, {
    onSuccess: () => {
      queryClient.invalidateQueries('spares');
    },
    onError: (error) => {
      error && setAlert({ message: error.response.data.message || '', color: 'error' });
    },
  });

  const formik = useFormik({
    initialValues: {
      name: part ? part.name : '',
      partno: part ? part.partno : '',
      price: part ? part.price : 0,
      photo: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required').max(100),
      partno: Yup.string().required('Required'),
      price: Yup.number().required('Required'),
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
        if (part) {
          mutate({ id: part._id, body: formData });
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
        <Text style={styles.headerText}>Spare</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Partno"
          value={formik.values.partno}
          onChangeText={formik.handleChange('partno')}
          onBlur={formik.handleBlur('partno')}
        />
        {formik.touched.partno && formik.errors.partno && (
          <Text style={styles.errorText}>{formik.errors.partno}</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Enter Part Name"
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
        />
        {formik.touched.name && formik.errors.name && (
          <Text style={styles.errorText}>{formik.errors.name}</Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Enter Price"
          keyboardType="number-pad"
          value={String(formik.values.price)}
          onChangeText={formik.handleChange('price')}
          onBlur={formik.handleBlur('price')}
        />
        {formik.touched.price && formik.errors.price && (
          <Text style={styles.errorText}>{formik.errors.price}</Text>
        )}
        <SelectPhotoComponent photo={part?.photo} file={file} setFile={setFile} />
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
    justifyContent: 'center',
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
    paddingVertical: 10,
    paddingHorizontal: 8,
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

export default CreateOrEditSparePartForm;
