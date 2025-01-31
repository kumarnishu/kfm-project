import React, { useContext, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import {
  FlatList,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import FuzzySearch from 'fuzzy-search';
import { CustomerService } from '../../services/CustomerService';
import { BackendError } from '../../..';
import CreateOrEditCustomerDialog from '../../components/dialogs/customers/CreateOrEditCustomerDialog';
import { toTitleCase } from '../../utils/toTitleCase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GetCustomerDto } from '../../dtos/CustomerDto';

type Props = StackScreenProps<AuthenticatedStackParamList, 'CustomersScreen'>;

const CustomersScreen: React.FC<Props> = ({ navigation }) => {
  const [dialog, setDialog] = useState<string>();
  const { user } = useContext(UserContext);
  const [customers, setCustomers] = useState<GetCustomerDto[]>([]);
  const [prefilteredCustomers, setPrefilteredCustomers] = useState<GetCustomerDto[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | undefined>();

  const { data, isSuccess, isLoading, isError, refetch } = useQuery<
    AxiosResponse<GetCustomerDto[]>,
    BackendError
  >(['customers'], async () => new CustomerService().GetAllCustomers());

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
      setCustomers(searcher.search(filter));
    } else {
      setCustomers(prefilteredCustomers);
    }
  }, [filter]);

  useEffect(() => {
    if (isSuccess) {
      setCustomers(data.data);
      setPrefilteredCustomers(data.data);
    }
  }, [isSuccess, data]);

  const renderCard = ({ item }: { item: GetCustomerDto }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CustomerDetailsScreen', { id: item._id })}
    >
      <Text style={styles.cardTitle}>{toTitleCase(item.name || 'Customer')}</Text>
      <Text style={styles.cardText}>Location: {item.address || 'Not available'}</Text>
      <Text style={styles.cardText}>Email: {item.email || 'Not available'}</Text>
      <Text style={styles.cardMembers}>{item.users || '0'} Members</Text>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007aff" />
        <Text>Loading Customers...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Failed to load customers. Please try again later.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={()=>refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Customers</Text>
        {user?.role === 'admin' && (
          <MaterialIcons
            name="add-circle"
            size={40}
            color="red"
            onPress={() => setDialog('CreateOrEditCustomerDialog')}
          />
        )}
      </View>

      <TextInput
        placeholder="Search"
        style={styles.searchInput}
        onChangeText={setFilter}
      />

      <FlatList
        data={customers}
        keyExtractor={(item) => item._id}
        renderItem={renderCard}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No customers found.</Text>}
      />

      <CreateOrEditCustomerDialog dialog={dialog} setDialog={setDialog} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    color: '#666',
  },
  cardMembers: {
    textAlign: 'right',
    color: 'grey',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007aff',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default CustomersScreen;
