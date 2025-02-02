import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
  visible: boolean,
  handleClose: () => void,
  fullScreen?: boolean,
  children?: React.ReactNode;
}
const Dialog = ({ visible, handleClose, fullScreen, children }: Props) => {
  const [isFullScreen, setIsFullScreen] = useState(fullScreen)
  useEffect(() => {
    setIsFullScreen(fullScreen)
  }, [fullScreen])
  return (
    <Modal
      animationType="fade"
      transparent={isFullScreen ? false : true}
      visible={visible}
      onRequestClose={handleClose}>
      <View style={[isFullScreen ? styles.fullScreen : styles.default, { backgroundColor: isFullScreen ? 'white' : 'transparent' }]}>
        {children}
      </View>
    </Modal >
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    justifyContent: 'center',
  },
  default: {
    flex: 1,
    backgroundColor: 'none',
    height: '70%',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    borderRadius: 5,
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
});

export default Dialog;