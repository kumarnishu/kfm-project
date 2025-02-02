import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import Dialog from '../../common/Dialog';
import { DropDownDto } from "../../../dtos/DropDownDto"
import { AxiosResponse } from 'axios';
import { useQuery } from 'react-query';
import { BackendError } from '../../../..';
import { CustomerService } from '../../../services/CustomerService';
import AntDesign from 'react-native-vector-icons/AntDesign';

type Props = {
  dialog: string | undefined,
  setDialog: React.Dispatch<React.SetStateAction<string | undefined>>,
  setValue: (value: string) => void
  value: string
}

const SelectCustomersComponent = ({ dialog, setDialog, setValue, value }: Props) => {
  const [preFilteredCustomers, setPreFilteredCustomers] = useState<DropDownDto[]>([]);
  const [customers, setCustomers] = useState<DropDownDto[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>();
  const { data: customersData, isSuccess } = useQuery<
    AxiosResponse<DropDownDto[]>,
    BackendError
  >('customers', new CustomerService().GetAllCustomersForDropDown);

  useEffect(() => {
    if (isSuccess && customersData) {
      setCustomers(customersData.data)
      setPreFilteredCustomers(customersData.data)
    }
  }, [isSuccess, customersData])

  useEffect(() => {
    if (searchQuery) {
      const filtered = customers.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCustomers(filtered);
    }
    else {
      setCustomers(preFilteredCustomers)
    }
  }, [searchQuery])

  return (
    <View style={{ backgroundColor: 'white' }}>
      {/* Customer Picker */}
      <TouchableOpacity style={styles.picker} onPress={() => setDialog('SelectCustomersComponentDialog')}>
        <Text style={styles.pickerText}>{customers.find(item => item.id == value)?.label || "Select A Customer"}</Text>
        <AntDesign
          name="caretdown"
          size={20}
          style={styles.pickerIcon}
          color="red"
        />
      </TouchableOpacity>
      <Dialog fullScreen={false} visible={dialog === 'SelectCustomersComponentDialog'} handleClose={() => setDialog(undefined)}
      >
        <View style={styles.container}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search options..."
            value={searchQuery}
            onChangeText={(val) => setSearchQuery(val)}
          />
          {customers && (
            <FlatList
              data={customers}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.optionItem, { backgroundColor: value == item.id ? 'red' : '' }]}
                  onPress={() => {
                    setValue(item.id)
                    setDialog(undefined)
                  }}
                >
                  <Text style={[styles.optionText, { color: value == item.id ? 'white' : '' }]}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          )}

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
    marginHorizontal: 10,
    height: 400,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'grey'
  },
  pickerText: {
    fontSize: 16, width: '80%'
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
    padding: 16,
    marginBottom: 5,
    borderRadius: 10,
    backgroundColor: '#eaeaea',
    borderBottomWidth: 2,
    borderColor: 'grey',
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

export default SelectCustomersComponent;
