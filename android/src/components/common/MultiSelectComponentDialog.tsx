import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dialog from './Dialog';

type Props = {
  dialog: string | undefined,
  setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
}

interface Option {
  id: string;
  label: string;
}

const MultiSelectComponentDialog= ({ dialog, setDialog }: Props) => {
  const [options] = useState<Option[]>([
    { id: '1', label: 'Apple' },
    { id: '2', label: 'Banana' },
    { id: '3', label: 'Orange' },
    { id: '4', label: 'Mango' },
    { id: '5', label: 'Pineapple' },
    { id: '6', label: 'Strawberry' },
  ]);

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleSelectionToggle = (id: string) => {
    setSelectedOptions((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id) // Deselect
        : [...prevSelected, id] // Select
    );
  };

  return (
    <Dialog fullScreen={false} visible={dialog === 'MultiSelectComponentDialog'} handleClose={() => setDialog(undefined)}
    >
      <View style={styles.container}>
        <Text style={styles.label}>Select Options:</Text>
        <FlatList
          data={options}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.optionContainer}
              onPress={() => handleSelectionToggle(item.id)}
            >
              <Ionicons
                name={selectedOptions.includes(item.id) ? 'checkbox' : 'square-outline'}
                size={24}
                color="black"
              />
              <Text style={styles.optionText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />
        {selectedOptions.length > 0 && (
          <Text style={styles.selectedText}>
            Selected: {selectedOptions.map((id) => options.find(opt => opt.id === id)?.label).join(', ')}
          </Text>
        )}
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 14,
  },
  selectedText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default MultiSelectComponentDialog;
