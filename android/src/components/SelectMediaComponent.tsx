import React, { useContext, useState } from 'react';
import {
  Text,
  IconButton,
} from 'react-native-paper';
import { View, PermissionsAndroid, Platform, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
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


function SelectMediaComponent({
  files, setFiles, photos
}: {
  files: { asset: Asset | null, id: number }[],
  photos?: { file: string, mediaType: string }[]
  setFiles: React.Dispatch<React.SetStateAction<{ asset: Asset | null, id: number }[]>>
}) {
  const { setAlert } = useContext(AlertContext)

  const selectMedia = async (source: 'camera' | 'gallery', options: {
    mediaType: string;
    maxWidth: number;
    maxHeight: number;
    quality: number;
  }) => {

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
        setFiles((prevFiles) =>
          [
            ...prevFiles,
            //@ts-ignore
            ...result.assets.map((as, i) => ({
              asset: as,
              id: prevFiles.length + i + 1,
            })),
          ]
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  const removeFile = (id: number) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };
  const renderFileItem = ({ item }: { item: { asset: Asset | null; id: number } }) => (
    <View style={styles.filePreview}>
      {item.asset?.type?.startsWith('image') ? (
        <Image source={{ uri: item.asset.uri }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.videoPlaceholder]}>
          <Text style={styles.videoText}>Video</Text>
        </View>
      )}
      <TouchableOpacity style={styles.removeButton} onPress={() => removeFile(item.id)}>
        <IconButton icon="close" size={20} />
      </TouchableOpacity>
    </View>
  );
  return (
    <>
      <FlatList
        data={files}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        renderItem={renderFileItem}
        contentContainerStyle={styles.previewContainer}
      />
      <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-around', marginVertical: 10 }}>
        {/* File Previews */}

        <View style={{ alignItems: 'center' }}>
          <IconButton
            icon="camera"
            mode="contained"
            size={30}
            onPress={() => {
              selectMedia('camera', {
                mediaType: 'photo',
                maxWidth: 800,
                maxHeight: 800,
                quality: 0.8,
              });
            }}
          />
          <Text>Capture</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <IconButton
            icon="video"
            mode="contained"
            size={30}
            onPress={() => {
              selectMedia('camera', {
                mediaType: 'video',
                maxWidth: 800,
                maxHeight: 800,
                quality: 0.8,
              });
            }}
          />
          <Text>Record</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <IconButton
            icon="image"
            mode="contained"
            size={30}
            onPress={() =>
              selectMedia('gallery', {
                mediaType: 'photo',
                maxWidth: 800,
                maxHeight: 800,
                quality: 0.8,
              })
            }
          />
          <Text>Gallery</Text>
        </View>
      </View>


    </>
  );
}
const styles = StyleSheet.create({
  previewContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  filePreview: {
    position: 'relative',
    marginRight: 10,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  videoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  videoText: {
    color: '#555',
    fontWeight: 'bold',
  },
  removeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
});

export default SelectMediaComponent;
