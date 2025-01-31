import React, { useContext, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { ActivityIndicator, FlatList, StyleSheet, View, Text, Button, TextInput, TouchableOpacity } from 'react-native';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import FuzzySearch from 'fuzzy-search';
import { BackendError } from '../../..';
import { CustomerService } from '../../services/CustomerService';
import { UserContext } from '../../contexts/UserContext';
import CreateOrEditStaffDialog from '../../components/dialogs/customers/CreateOrEditStaffDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GetUserDto } from '../../dtos/UserDto';

type Props = StackScreenProps<AuthenticatedStackParamList, 'StaffsScreen'>;

const StaffsScreen: React.FC<Props> = ({ navigation }) => {
  const [dialog, setDialog] = useState<string>()
  const { user } = useContext(UserContext);
  const [engineers, setEngineers] = useState<GetUserDto[]>([])
  const [engineer, setEngineer] = useState<GetUserDto>()
  const [prefilteredEngineers, setPrefilteredEngineers] = useState<GetUserDto[]>([])
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const [filter, setFilter] = useState<string | undefined>()
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>(["staff"], async () => new CustomerService().GetAllStaffs())

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
    <View style={styles.card} onTouchEnd={() => navigation.navigate('StaffDetailsScreen', { id: item._id })}>
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.username ? item.username.charAt(0).toUpperCase() : "C"}
          </Text>
        </View>
        <View style={styles.cardTitle}>
          <Text style={styles.title}>{item.username.toUpperCase()}</Text>
          <Text style={styles.subtitle}>Mob: {item.mobile || "N/A"}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text>Company: {item.customer.label.toUpperCase() || ''}</Text>
        <Text>Email: {item.email || ''}</Text>
        {user?.role === "owner" && (
          <TouchableOpacity onPress={() => {
            setEngineer(item)
            setDialog('CreateOrEditStaffDialog')
          }}>
            <Text style={styles.editButton}>Edit Engineer</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
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
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: 350 }}>
        <Text style={styles.pageTitle}>Staff Members</Text>
        {user?.role === "owner" && 
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
      <TextInput style={styles.searchInput} placeholder='Search' onChangeText={(val) => setFilter(val)} />

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
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
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
    overflow: 'hidden', // Prevent content from overflowing rounded corners
  },
  cardHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6200ea',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardTitle: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'black',
    flexWrap: 'wrap',
  },
  cardContent: {
    padding: 16,
  },
  editButton: {
    color: '#6200ea',
    textAlign: 'right',
    marginTop: 10,
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
