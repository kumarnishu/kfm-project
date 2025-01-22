import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { BackendError } from '../../..';
import FuzzySearch from 'fuzzy-search';
import { Card, Avatar, Button, Text, TextInput } from 'react-native-paper';
import { GetUserDto } from '../../dto/UserDto';
import { GetAllCustomersStaffForAdmin } from '../../services/CustomerService';
import { toTitleCase } from '../../utils/toTitleCase';

type Props = StackScreenProps<AuthenticatedStackParamList, 'CustomerDetailsScreen'>;

const CustomerDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [customers, setCustomers] = useState<GetUserDto[]>([])
  const [prefilteredCustomers, setPrefilteredCustomers] = useState<GetUserDto[]>([])
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const [filter, setFilter] = useState<string | undefined>()
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>(["users", id], async () => GetAllCustomersStaffForAdmin({ id: String(id) }))

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };



  useEffect(() => {
    if (isSuccess) {
      setCustomers(data.data)
    }
  }, [isSuccess, data])
  // Render each customer as a card

  const renderCard = ({ item }: { item: GetUserDto }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('CustomerDetailsScreen', { id: item._id })}>
      <Card.Content>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{`${item.username.toUpperCase()}-(${item.role.toUpperCase()})`}</Text>
        <Text>{`${toTitleCase(item.customer.label || "Not available")}`}</Text>
        <Text style={{ color: 'grey' }} >Mobile : {item.mobile || "Not available"}</Text>
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
    <View style={styles.container}>
      {/* Title */}

      <Text style={styles.title}>Members</Text>



      {/* Customer List */}
      <FlatList
        data={customers}
        keyExtractor={(item) => item._id}
        renderItem={renderCard}
        refreshing={refreshing} // Indicates if the list is refreshing
        onRefresh={onRefresh} // Handler for pull-to-refresh
        ListEmptyComponent={
          <Text style={styles.emptyText}>No customers found.</Text>
        }
      />


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
    marginBottom: 16, textAlign: 'center'
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

export default CustomerDetailsScreen;
