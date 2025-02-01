import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Dialog from './Dialog';

type Props = {
    dialog: string | undefined,
    setDialog: React.Dispatch<React.SetStateAction<string | undefined>>
}

const SingleSelectComponentDialog = ({dialog,setDialog}:Props) => {
  const [options] = useState([
    'Apple',
    'Banana',
    'Orange',
    'Mango',
    'Pineapple',
    'Strawberry',
  ]);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = options.filter(option =>
      option.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setSearchQuery('');
  };

  return (
    <Dialog fullScreen={false} visible={dialog === 'SingleSelectComponentDialog'} handleClose={() => setDialog(undefined)}
    >
      <View style={styles.container}>
        <Text style={styles.label}>Select an option:</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search options..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <FlatList
            data={filteredOptions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => handleSelectOption(item)}
              >
                <Text style={styles.optionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}
        {selectedOption ? (
          <Text style={styles.selectedText}>Selected: {selectedOption}</Text>
        ) : null}
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
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  optionItem: {
    padding: 12,
    backgroundColor: '#eaeaea',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: 14,
  },
  selectedText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SingleSelectComponentDialog;
