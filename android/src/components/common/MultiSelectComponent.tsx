import React, { Component, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import { DropDownDto } from '../../dtos/DropDownDto';

type Props = {
  selectedItems: string[],
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>,
  items: DropDownDto[]
}
const MultiSelectComponent = ({ selectedItems,setSelectedItems,items}: Props) => {
  const onSelectedItemsChange = (item: any) => {
    setSelectedItems(item); // Update selected items
  };

  return (
    <View style={styles.container}>
      <MultiSelect
        items={items.map((item) => ({
          id: item.id,
          name: item.label,
        }))}
        uniqueKey="id"
        onSelectedItemsChange={onSelectedItemsChange}
        selectedItems={selectedItems}
        selectText="Pick Customers"
        searchInputPlaceholderText="Search Customers..."
        tagRemoveIconColor="#000"
        tagBorderColor="#ccc"
        tagTextColor="#000"
        selectedItemTextColor="#000"
        selectedItemIconColor="#000"
        itemTextColor="#000"
        displayKey="name"
        searchInputStyle={{ color: '#000' }}
        submitButtonColor="#007BFF"
        submitButtonText="Submit"
      />
    </View>
  );
};

export default MultiSelectComponent;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
});



