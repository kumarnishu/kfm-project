import React from 'react';
import Video from "react-native-video"
import Dialog from "../Dialog"
import { Dimensions, Image, StyleSheet, View } from "react-native"

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
    media: {
        type: "video" | "photo";
        url: string;
    } 
}

function ViewMediaDialog({ media, dialog, setDialog }: Props) {
 const { width, height } = Dimensions.get('window'); 
    return (
        <Dialog fullScreen={false} visible={dialog === 'ViewMediaDialog'} handleClose={() => setDialog(undefined)}
        >
            {media.type == 'photo' ?
                <Image
                    source={{ uri: media.url }}
                    style={{ width: '100%', height: 300, marginBottom: 10, borderRadius: 10, borderWidth: 5, borderColor: 'whitesmoke' }}
                />
                :

                <View style={styles.container}>
                    <Video
                        source={{ uri: media.url }}
                        repeat={true}
                        // Replace with your video URL
                        style={[styles.video,{width, height}]} // Apply dynamic width and height
                        resizeMode="cover" // Ensures the video covers the screen while maintaining aspect ratio
                        controls={true} // Shows video controls like play/pause
                    />
                </View>
            }
        </Dialog>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',  // Background color to make video fullscreen stand out
    },
    video: {
        position: 'absolute', // Position video absolutely to fill the screen
        top: 0,
        left: 0,
    },
});
export default ViewMediaDialog
