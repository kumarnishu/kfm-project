import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import React from 'react'
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

type Props = {
  visible: boolean,
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  date: string,
  setDate: (date: string) => void,
  isDisabled?: boolean
}
const DatePickerComponent = ({ visible, setVisible, isDisabled, date, setDate }: Props) => {
  console.log("initial date",date)
  return (
    <View>
      <TouchableOpacity disabled={isDisabled ? true : false} onPress={() => setVisible(true)}>
        <TextInput
          style={styles.input}
          placeholder="Installation Date"
          value={moment(date).format("DD-MM-YYYY")}
          editable={false}
        />
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={visible}
        mode="date"
        onConfirm={(val) => {
          setDate(new Date(val).toString())
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      />
    </View >
  )
}
const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    marginBottom: 15,
    padding: 10,
    fontSize: 18,
    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
})
export default DatePickerComponent