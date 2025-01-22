import React, { useContext, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { ActivityIndicator, Surface, Text } from 'react-native-paper';
import { FlatList, StyleSheet, View } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { Button, Card, TextInput } from 'react-native-paper';
import FuzzySearch from 'fuzzy-search';
import { GetAllCustomers } from '../../services/CustomerService';
import { BackendError } from '../../..';
import { GetCustomerDto } from '../../dto/CustomerDto';
import CreateOrEditCustomerDialog from '../../components/dialogs/customers/CreateOrEditCustomerDialog';
import { toTitleCase } from '../../utils/toTitleCase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = StackScreenProps<AuthenticatedStackParamList, 'CustomersScreen'>;

const CustomersScreen: React.FC<Props> = ({ navigation }) => {
  const [dialog, setDialog] = useState<string>()
  const { user } = useContext(UserContext);
  const [customers, setCustomers] = useState<GetCustomerDto[]>([])
  const [prefilteredCustomers, setPrefilteredCustomers] = useState<GetCustomerDto[]>([])
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const [filter, setFilter] = useState<string | undefined>()
  // Fetch customers data
  const { data, isSuccess, isLoading, isError, refetch } = useQuery<
    AxiosResponse<GetCustomerDto[]>,
    BackendError
  >(["customers"], async () => GetAllCustomers());

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (filter) {
      const searcher = new FuzzySearch(customers, ['name', 'address', 'email'], {
        caseSensitive: false,
      });
      const result = searcher.search(filter);
      setCustomers(result)
    }
    if (!filter)
      setCustomers(prefilteredCustomers)
  }, [filter])

  useEffect(() => {
    if (isSuccess) {
      setCustomers(data.data)
      setPrefilteredCustomers(data.data)
    }
  }, [isSuccess, data])
  // Render each customer as a card
  const renderCard = ({ item }: { item: GetCustomerDto }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('CustomerDetailsScreen', { id: item._id })}>
      <Card.Content>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{toTitleCase(item.name || "") || "Customer"}</Text>
        <Text>{`Location : ${item.address || "Not available"}`}</Text>
        <Text>Email : {item.email || "Not available"}</Text>
        <Text style={{ textAlign: 'right', color: 'grey' }} > {item.users || "0"} Members</Text>
      </Card.Content>
    </Card>
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading Customers...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loader}>
        <Text>Failed to load customers. Please try again later.</Text>
        <Button mode="contained" onPress={() => refetch()}>
          Retry
        </Button>
      </View>
    );
  }
  return (
    <>
      <Surface elevation={2} style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: 350 }}>
          <Text style={styles.title}>Customers</Text>
          {user?.role == "admin" &&  <MaterialIcons
              name="add-circle"
              size={40}
              color="red"
              onPress={() => {
                setDialog('CreateOrEditCustomerDialog')
              }}
            />}
        </View>
        <TextInput mode="flat" placeholder='Search' style={{ backgroundColor: 'white', marginBottom: 10 }} onChangeText={(val) => setFilter(val)} />


        {customers && <FlatList
          data={customers}
          keyExtractor={(item) => item._id}
          renderItem={renderCard}
          refreshing={refreshing} // Indicates if the list is refreshing
          onRefresh={onRefresh} // Handler for pull-to-refresh
          ListEmptyComponent={
            <Text style={styles.emptyText}>No customers found.</Text>
          }
        />}
      </Surface >
      <CreateOrEditCustomerDialog dialog={dialog} setDialog={setDialog} />
    </>

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

export default CustomersScreen;
