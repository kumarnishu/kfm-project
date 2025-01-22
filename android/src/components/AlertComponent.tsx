import React, { useContext } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { AlertContext } from '../contexts/AlertContext';
import { Button, Snackbar, Text } from 'react-native-paper';

export default function AlertComponent() {
    const { alert, setAlert } = useContext(AlertContext)

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
                        <Snackbar style={[{
                            backgroundColor: alert.color == 'error' ? 'red' : 'green'
                        }]}
                            visible={!!alert}
                            onDismiss={() => setAlert(undefined)}
                            action={{
                                label: 'Close',
                                onPress: () => setAlert(undefined),
                            }}
                            duration={3000}
                        >
                            {alert.message}
                        </Snackbar>
                    </View> :
                    <>
                        <View style={styles.modalOverlay}>
                            <View style={[alert.color == 'error' ? styles.errorAlertBox : styles.successAlertBox, { borderRadius: 10 }]}>
                                <Text style={styles.alertTitle}>Alert</Text>
                                <Text style={styles.alertMessage}>{alert.message}</Text>
                                <Button labelStyle={{ color: 'white' }} onPress={() => setAlert(undefined)} >OK</Button>
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
        marginBottom: 20,
    },
});
