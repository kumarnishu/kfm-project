import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';

type Props = {
    visible: boolean,
    handleClose: () => void,
    position: "right" | "left",
    children?: React.ReactNode;
}

const Drawer = ({ visible, handleClose, position, children }: Props) => {
    return (
        <Modal
            animationType="none"
            transparent={visible ? visible : false}
            visible={visible}
            onRequestClose={handleClose}>
            {/* BlurView for background blur effect */}
            <BlurView
                style={styles.modalBackground}
                blurType="light"
                blurAmount={10}
            >
                <View style={position === "right" ? styles.rightDrawer : styles.leftDrawer}>
                    {children}
                </View>
            </BlurView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay to give the blur effect prominence
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightDrawer: {
        backgroundColor: 'white',
        flex: 1,
        marginLeft:'30%',
        width:'80%',
        flexDirection: 'column',
        gap: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10,
    },
    leftDrawer: {
        marginRight: 100,
        backgroundColor: 'white',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 10,
    }
});

export default Drawer;