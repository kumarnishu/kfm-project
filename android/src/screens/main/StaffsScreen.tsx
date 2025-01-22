import React, { useContext, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Text } from 'react-native-paper';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { Avatar, Button, Card, TextInput } from 'react-native-paper';
import FuzzySearch from 'fuzzy-search';
import { BackendError } from '../../..';
import { GetAllStaffs } from '../../services/CustomerService';
import { GetUserDto } from '../../dto/UserDto';
import { UserContext } from '../../contexts/UserContext';
import CreateOrEditStaffDialog from '../../components/dialogs/customers/CreateOrEditStaffDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';



type Props = StackScreenProps<AuthenticatedStackParamList, 'StaffsScreen'>;

const StaffsScreen: React.FC<Props> = ({ navigation }) => {
  const [dialog, setDialog] = useState<string>()
  const { user } = useContext(UserContext);
  const [engineers, setEngineers] = useState<GetUserDto[]>([])
  const [engineer, setEngineer] = useState<GetUserDto>()
  const [prefilteredEngineers, setPrefilteredEngineers] = useState<GetUserDto[]>([])
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const [filter, setFilter] = useState<string | undefined>()
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>(["staff"], async () => GetAllStaffs())

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (filter) {
      const searcher = new FuzzySearch(engineers, ['username', 'email', 'mobile'], {
        caseSensitive: false,
      });
      const result = searcher.search(filter);
      setEngineers(result)
    }
    if (!filter)
      setEngineers(prefilteredEngineers)
  }, [filter])

  useEffect(() => {
    if (isSuccess) {
      setEngineers(data.data)
      setPrefilteredEngineers(data.data)
    }
  }, [isSuccess, data])
  // Render each engineer as a card
  const renderCard = ({ item }: { item: GetUserDto }) => (

    <Card style={styles.card} onPress={() => navigation.navigate('StaffDetailsScreen', { id: item._id })}>
      <Card.Title
        style={{ width: '100%' }}
        title={item.username.toUpperCase()}
        subtitle={`Mob : ${item.mobile || "N/A"}`}
        subtitleStyle={{ color: 'black', flexWrap: 'wrap' }}
        left={(props) => (
          <Avatar.Text
            {...props}
            label={item.username ? item.username.charAt(0).toUpperCase() : "C"}
          />
        )}
      />
      <Card.Content>
        <Text style={{ marginLeft: 56 }}>Company : {item.customer.label.toUpperCase() || ''}</Text>
        <Text style={{ marginLeft: 56 }}>Email : {item.email || ''}</Text>
        {user?.role == "owner" &&<Button onPress={() => {
          setEngineer(item)
          setDialog('CreateOrEditStaffDialog')
        }} labelStyle={{ width: '100%', textAlign: 'right' }} mode='text'  rippleColor="transparent">Edit Engineer</Button>}
      </Card.Content>
    </Card>
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading Engineers...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loader}>
        <Text>Failed to load engineers. Please try again later.</Text>
        <Button mode="contained" onPress={() => refetch()}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: 350 }}>
        <Text style={styles.title}>Staff Memebers</Text>
        {user?.role == "owner" && 
         <MaterialIcons
         name="add-circle"
         size={40}
         color="red"
         onPress={() => {
          setEngineer(undefined)
          setDialog('CreateOrEditStaffDialog')
         }}
       />

       }
      </View>
      <TextInput style={{ marginBottom: 10 }} placeholder='Search' mode='outlined' onChangeText={(val) => setFilter(val)} />


      {/* Engineer List */}
      {engineers && <FlatList
        data={engineers}
        keyExtractor={(item) => item._id}
        renderItem={renderCard}
        refreshing={refreshing} // Indicates if the list is refreshing
        onRefresh={onRefresh} // Handler for pull-to-refresh
        ListEmptyComponent={
          <Text style={styles.emptyText}>No engineers found.</Text>
        }
      />}

      <CreateOrEditStaffDialog dialog={dialog} setDialog={setDialog} staff={engineer} customer={user?.customer.id || ""} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  toggleButton: {
    marginTop: 16,
  },
});
export default StaffsScreen;
