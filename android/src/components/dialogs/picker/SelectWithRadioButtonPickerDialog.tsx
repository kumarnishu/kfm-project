import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Dialog from '../../common/Dialog';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { DropDownDto } from '../../../dtos/DropDownDto';

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>,
    setValue: (value: DropDownDto) => void
    value?: DropDownDto
    options: DropDownDto[]
}

const SelectWithRadioButtonPickerDialog = ({ dialog, setDialog, setValue, value, options }: Props) => {
    const [items, setItems] = useState(options);

    useEffect(() => {
        setItems(options)
    }, [options])

    return (
        <View style={{ backgroundColor: 'white' }}>
            <Dialog fullScreen={false} visible={dialog === 'SelectWithRadioButtonPickerDialog'} handleClose={() => setDialog(undefined)}>
                <View style={styles.container}>

                    {items && (
                        <FlatList
                            data={items}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.optionItem]}
                                    onPress={() => {
                                        setValue(item);
                                    }}
                                >
                                    <View style={styles.optionContainer}>
                                        <FontAwesome
                                            name={value?.id === item.id ? 'dot-circle-o' : 'circle-o'}
                                            size={20}
                                            color={value?.id === item.id ? 'red' : 'black'}
                                            style={styles.radioButton}
                                        />
                                        <Text style={[styles.optionText, { color: value?.id === item.id ? 'red' : '' }]}>{item.label}</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    )}
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setDialog('NewServiceRequestsDialog')}
                        disabled={!value}
                    >
                        <Text style={styles.buttonText}>Next Step</Text>
                    </TouchableOpacity>
                </View>
            </Dialog>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingTop: 100,
        height: 400,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    picker: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'grey'
    },
    button: {
        padding: 16,
        borderRadius: 10,
        marginBottom:20,
        backgroundColor: 'red'
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    pickerText: {
        fontSize: 16,
        width: '80%'
    },
    pickerIcon: {
        padding: 10
    },
    searchInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 20,
        fontSize: 20,
        marginVertical: 10,
        backgroundColor: '#fff',
    },
    optionItem: {
        padding: 30,
        marginBottom: 5,
        borderRadius: 10,
        backgroundColor: '#eaeaea',
        borderBottomWidth: 2,
        borderColor: 'grey',
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        marginRight: 10
    },
    optionText: {
        fontSize: 18,
    },
    selectedText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SelectWithRadioButtonPickerDialog;
