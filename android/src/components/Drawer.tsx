import React from 'react';
import { Modal, ScrollView, StyleSheet } from 'react-native';


type Props = {
    visible: boolean,
    handleClose: () => void,
    position: "right" | "left",
    children?: React.ReactNode;
}
const Drawer = ({ visible, handleClose, position, children }: Props) => {
    return (
        <Modal
            animationType="fade"
            transparent={visible ? visible : false}
            visible={visible}
            onRequestClose={handleClose}>
            <ScrollView contentContainerStyle={position === "right" ? styles.rightDrawer : styles.leftDrawer}>
                {children}
            </ScrollView>
        </Modal>

    );
};

const styles = StyleSheet.create({
    rightDrawer: {
        marginLeft: 100,
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
    },
    leftDrawer: {
        marginRight: 100,
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