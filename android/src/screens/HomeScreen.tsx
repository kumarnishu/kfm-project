import React, { useContext } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthenticatedStackParamList } from '../navigation/AppNavigator';
import { UserContext } from '../contexts/UserContext';
import { View, Text } from 'react-native';

type Props = StackScreenProps<AuthenticatedStackParamList, 'HomeScreen'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useContext(UserContext)
  return (
    <View style={{ flex: 1 }} >
      <Text style={{ fontSize: 30, fontWeight: 'bold', padding: 20, color: 'red' }}>Dashboard</Text>
    </View >
  );
};

export default HomeScreen;
