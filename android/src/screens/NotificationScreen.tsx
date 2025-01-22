import React, { useContext, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Surface, Text } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { AuthenticatedStackParamList } from '../navigation/AppNavigator';
import SelectMediaComponent from '../components/SelectMediaComponent';
import { Asset } from 'react-native-image-picker';

type Props = StackScreenProps<AuthenticatedStackParamList, 'NotificationScreen'>;

const NotificationScreen: React.FC<Props> = ({ navigation }) => {
  const { setUser } = useContext(UserContext)
  const [files, setFiles] = useState<{ asset: Asset | null, id: number }[]>([])
  console.log(files)
  return (
    <Surface elevation={2} style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <SelectMediaComponent files={files} setFiles={setFiles} />
    </Surface >
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

export default NotificationScreen;
