import React, { useContext, useEffect } from 'react';
import { View, Modal, StyleSheet, Text, Button, Touchable, TouchableOpacity } from 'react-native';
import { AlertContext } from '../../contexts/AlertContext';

export default function AlertComponent() {
    const { alert, setAlert } = useContext(AlertContext)

    useEffect(() => {
        if (alert?.type == "snack")
            setTimeout(() => {
                setAlert(undefined)
            }, 3000);
    }, [alert])

    return (
        <Modal
            transparent
            animationType="fade"
            visible={alert ? true : false}
            onRequestClose={() => setAlert(undefined)}
        >
            {alert && <>
                {alert.type == 'snack' ?
                    <View style={styles.modalOverlay}>
                        <View style={[styles.snackAlertBox, { backgroundColor: alert.color == "error" ? 'rgba(200,0,0,0.8)' : 'rgba(0,0,0,0.8)', }]}>
                            <Text style={styles.alertMessage}>{alert.message}</Text>
                        </View>
                    </View> :
                    <>
                        <View style={styles.modalOverlay}>
                            <View style={[alert.color == 'error' ? styles.errorAlertBox : styles.successAlertBox, { borderRadius: 10 }]}>
                                <Text style={styles.alertTitle}>Alert</Text>
                                <Text style={styles.alertMessage}>{alert.message}</Text>

                                <TouchableOpacity onPress={() => setAlert(undefined)}>
                                    <Text style={{ textAlign: 'center', marginTop: 20, padding: 10, fontSize: 16, color: 'white' }}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                }
            </>}
        </Modal>
    );
}

const styles = StyleSheet.create({

    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
    },
    snackAlertBox: {
        width: '90%',
        padding: 15,
        borderRadius: 5,
        position: 'absolute',
        bottom: 20,
        alignItems: 'center',
    },
    successAlertBox: {
        width: 300,
        padding: 20,
        backgroundColor: 'green',
        borderRadius: 10,
    },
    errorAlertBox: {
        width: 300,
        padding: 20,
        backgroundColor: 'rgb(155,0,0)',
        borderRadius: 10,
    },
    alertTitle: {
        fontSize: 20,
        textAlign: 'center',
        padding: 10,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    alertMessage: {
        fontSize: 16,
        letterSpacing: 1.1,
        color: 'white',
    },
});