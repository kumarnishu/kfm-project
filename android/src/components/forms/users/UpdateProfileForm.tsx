// import React, { useContext, useEffect, useState } from 'react';
// import { StyleSheet, ScrollView, Image } from 'react-native';
// import { Button, TextInput, HelperText, Text, Surface } from 'react-native-paper';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useMutation } from 'react-query';
// import * as ImagePicker from 'expo-image-picker';
// import { AxiosResponse } from 'axios';
// import { UserContext } from '../../../contexts/UserContext';
// import { AlertContext } from '../../../contexts/alertContext';
// import { BackendError } from '../../../..';

// function UpdateProfileForm({ setDialog }: { setDialog: React.Dispatch<React.SetStateAction<string | undefined>> }) {
//     const { user } = useContext(UserContext)
//     const { setAlert } = useContext(AlertContext)
//     const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
//     const { mutate, isSuccess, isLoading, error } = useMutation<
//         AxiosResponse<{ message: string }>,
//         BackendError,
//         FormData
//     >(UpdateProfile, {
//         onError: ((error) => {
//             error && setAlert({ message: error.response.data.message || "", color: 'error' })
//         }),
//         onSuccess: () => queryClient.invalidateQueries('profile')
//     });


//     const formik = useFormik({
//         initialValues: {
//             email: user?.email || "",
//             mobile: user?.mobile || "",
//             dp: null,
//         },
//         validationSchema: Yup.object({
//             email: Yup.string().required('Required').email('Invalid email'),
//             mobile: Yup.string().required('Required').length(10),
//         }),
//         onSubmit: (values) => {
//             const formData = new FormData();
//             Object.entries(values).forEach(([key, value]) => {
//                 if (value) {
//                     formData.append(key, value);
//                 }
//             });
//             mutate(formData);
//         },
//     });

//     useEffect(() => {
//         if (isSuccess) {
//             setAlert({ message: `updated profile`, color: 'success' })
//             formik.resetForm()
//             setDialog(undefined)
//         }

//     }, [isSuccess]);

//     const handleImagePicker = async () => {
//         const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
//         if (!permission.granted) {
//             setAlert({ message: 'Permission required Please grant media access to pick an image.', color: 'warning' })
//             return;
//         }

//         const result = await ImagePicker.launchImageLibraryAsync({
//             mediaTypes: ImagePicker.MediaTypeOptions.Images,
//             allowsEditing: true,
//             aspect: [4, 3],
//             quality: 1,
//         });
//         if (!result.canceled) {
//             setSelectedImage(result.assets[0]);
//             formik.setFieldValue('dp', {
//                 uri: result.assets[0].uri,
//                 type: result.assets[0].mimeType || 'image/*',
//                 name: result.assets[0].fileName + String(Number(new Date())),
//             });
//         }
//         else {
//             setSelectedImage(null);
//         }
//     };
//     return (
//         <>
//             <ScrollView>
//                 <Surface elevation={0} style={styles.form}>

//                     <Image source={{ uri: selectedImage ? selectedImage.uri : user?.dp }} style={styles.selectedImage} />
//                     <Text style={{ fontSize: 25, textAlign: 'center', padding: 20, fontWeight: 'bold' }}>UPDATE PROFILE</Text>


//                     <TextInput
//                         style={{ padding: 10 }}
//                         label="Email"
//                         mode="outlined"
//                         value={formik.values.email}
//                         onChangeText={formik.handleChange('email')}
//                         onBlur={formik.handleBlur('email')}
//                         error={formik.touched.email && Boolean(formik.errors.email)}
//                     />
//                     <HelperText type="error" visible={formik.touched.email && Boolean(formik.errors.email)}>
//                         {formik.errors.email}
//                     </HelperText>

//                     <TextInput
//                         style={{ padding: 10 }}
//                         label="Mobile"
//                         mode="outlined"
//                         keyboardType="number-pad"
//                         value={formik.values.mobile}
//                         onChangeText={formik.handleChange('mobile')}
//                         onBlur={formik.handleBlur('mobile')}
//                         error={formik.touched.mobile && Boolean(formik.errors.mobile)}
//                     />
//                     <HelperText type="error" visible={formik.touched.mobile && Boolean(formik.errors.mobile)}>
//                         {formik.errors.mobile}
//                     </HelperText>



//                     <Button              
//                         icon="file"
//                         mode="outlined"
//                         onPress={handleImagePicker}
//                         style={styles.imagePickerButton}
//                     >
//                         Choose Display Picture
//                     </Button>


//                     <HelperText type="error" visible={formik.touched.dp && Boolean(formik.errors.dp)}>
//                         {formik.errors.dp}
//                     </HelperText>

//                     <Button
//                         contentStyle={{ padding: 10 }}
//                           buttonColor='red'
//                         textColor='white'
//                         mode="contained"
//                         onPress={() => formik.handleSubmit()}
//                         loading={isLoading}
//                         disabled={isLoading}
//                     >
//                         Submit
//                     </Button>

//                 </Surface>
//             </ScrollView>
//         </>
//     );
// }

// const styles = StyleSheet.create({

//     form: {
//         gap: 1,
//         paddingHorizontal: 10,
//         paddingTop: 50,
//     },
//     imageView: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center'
//     },
//     selectedImage: {
//         width: 100,
//         height: 100,
//         borderRadius: 75,
//         marginBottom: 16,
//         marginLeft: 125
//     },
//     imagePickerButton: {
//         marginBottom: 16,
//         width: '100%',
//         padding: 5
//     }
// });

// export default UpdateProfileForm;