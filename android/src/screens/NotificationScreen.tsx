import React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import {  View, Text } from 'react-native';
import { AuthenticatedStackParamList } from '../navigation/AppNavigator';

type Props = StackScreenProps<AuthenticatedStackParamList, 'NotificationScreen'>;

const NotificationScreen: React.FC<Props> = ({ navigation }) => {

  return (
    <View style={{ flex: 1 }} >
      <Text style={{ fontSize: 30, fontWeight: 'bold', padding: 20, color: 'red' }}>Dashboard</Text>
    </View >
  );
};


export default NotificationScreen;
