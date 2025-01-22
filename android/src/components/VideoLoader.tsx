import { Dimensions, StyleSheet, View } from "react-native";
import Video from "react-native-video";

const VideoLoader = ({ videoUrl }: { videoUrl: string }) => {
  const { width, height } = Dimensions.get('window');  // Get screen dimensions

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: videoUrl }}
        repeat={true}
        // Replace with your video URL
        style={[styles.video, { width, height }]} // Apply dynamic width and height
        resizeMode="cover" // Ensures the video covers the screen while maintaining aspect ratio
        controls={false} // Shows video controls like play/pause
      />
    </View>
  );
};

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

export default VideoLoader;
