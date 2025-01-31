import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';

type Props = StackScreenProps<AuthenticatedStackParamList, 'StaffDetailsScreen'>;

const StaffDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [dialog, setDialog] = useState<string>()
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details Screen</Text>
      <Text>Item ID: {id}</Text>
      <Button title="Go Back" onPress={() => setDialog('CreateOrEditStaffDialog')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default StaffDetailsScreen;
