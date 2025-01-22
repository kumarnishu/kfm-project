import React, { useContext, useState } from 'react';
import {
  Text,
  IconButton,
} from 'react-native-paper';
import { View, Image, PermissionsAndroid, Platform } from 'react-native';
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { AlertContext } from '../contexts/AlertContext';



async function requestCameraPermission() {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app requires access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true;
}


function SelectPhotoComponent({
  file, setFile, photo
}: {
  file: Asset | null,
  photo?: string
  setFile: React.Dispatch<React.SetStateAction<Asset | null>>
}) {
  const [preview, setPreview] = useState<string | undefined>();
  const { setAlert } = useContext(AlertContext)

  const selectPhoto = async (source: 'camera' | 'gallery') => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.8,
    };
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      setAlert({ message: 'Camera permission is required', color: 'error' });
      return;
    }
    try {
      const result =
        source === 'camera'
          //@ts-ignore
          ? await launchCamera(options)
          //@ts-ignore
          : await launchImageLibrary(options);

      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        setFile(selectedFile as unknown as File);
        setPreview(selectedFile.uri);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {preview ? (
        <Image
          source={{ uri: preview }}
          style={{ width: '100%', height: 300, marginBottom: 10, borderRadius: 10, borderWidth: 5, borderColor: 'whitesmoke' }}
        />) :
        (

          photo && <Image
            source={{ uri: photo }}
            style={{ width: '100%', height: 300, marginBottom: 10, borderRadius: 10, borderWidth: 5, borderColor: 'whitesmoke' }}
          />
        )
      }
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
        <View style={{ alignItems: 'center' }}>
          <IconButton
            icon="camera"
            mode="contained"
            size={30}
            onPress={() => selectPhoto('camera')}
          />
          <Text>Take Photo</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <IconButton
            icon="image"
            mode="contained"
            size={30}
            onPress={() => selectPhoto('gallery')}
          />
          <Text>Gallery</Text>
        </View>


      </View>
    </>
  );
}

export default SelectPhotoComponent;
