import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text, Button, TextInput } from 'react-native';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { BackendError } from '../../..';
import FuzzySearch from 'fuzzy-search';
import { CustomerService } from '../../services/CustomerService';
import { toTitleCase } from '../../utils/toTitleCase';
import { GetUserDto } from '../../dtos/UserDto';

type Props = StackScreenProps<AuthenticatedStackParamList, 'CustomerDetailsScreen'>;

const CustomerDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id } = route.params;
  const [customers, setCustomers] = useState<GetUserDto[]>([])
  const [prefilteredCustomers, setPrefilteredCustomers] = useState<GetUserDto[]>([])
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const [filter, setFilter] = useState<string | undefined>()
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>(["users", id], async () => new CustomerService().GetAllCustomersStaffForAdmin({ id: String(id) }))

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

  useEffect(() => {
    if (filter) {
      const searcher = new FuzzySearch(customers, ['username', 'mobile'], {
        caseSensitive: false,
      });
      const result = searcher.search(filter);
      setCustomers(result)
    }
    if (!filter)
      setCustomers(prefilteredCustomers)
  }, [filter])

  // Render each customer as a card
  const renderCard = ({ item }: { item: GetUserDto }) => (
    <View style={styles.card} onTouchEnd={() => navigation.navigate('CustomerDetailsScreen', { id: item._id })}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{`${item.username.toUpperCase()}-(${item.role.toUpperCase()})`}</Text>
        <Text>{`${toTitleCase(item.customer.label || "Not available")}`}</Text>
        <Text style={styles.cardSubtitle}>Mobile : {item.mobile || "Not available"}</Text>
      </View>
    </View>
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
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Members</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        onChangeText={(val) => setFilter(val)}
      />

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
    marginBottom: 16,
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 8,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  cardSubtitle: {
    color: 'grey',
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
});

export default CustomerDetailsScreen;
