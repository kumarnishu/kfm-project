import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text, Button, TextInput, TouchableOpacity, Image, Linking } from 'react-native';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { BackendError } from '../../..';
import { CustomerService } from '../../services/CustomerService';
import { GetUserDto } from '../../dtos/UserDto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { AlertContext } from '../../contexts/AlertContext';

type Props = StackScreenProps<AuthenticatedStackParamList, 'CustomerDetailsScreen'>;

const CustomerDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { id, data: routedata } = route.params;
  const { setAlert } = useContext(AlertContext)
  const [customers, setCustomers] = useState<GetUserDto[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | undefined>();
  const [debouncedFilter, setDebouncedFilter] = useState<string | undefined>();
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>(["users", id, debouncedFilter], async () => new CustomerService().GetAllCustomersStaffForAdmin({ id: String(id), search: debouncedFilter }));

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const requestCallPermissionAndCall = (phoneNumber) => {
    check(PERMISSIONS.ANDROID.CALL_PHONE).then((result) => {
      if (result === RESULTS.GRANTED) {
        Linking.openURL(`tel:${phoneNumber}`);
      } else {
        request(PERMISSIONS.ANDROID.CALL_PHONE).then((permission) => {
          if (permission === RESULTS.GRANTED) {
            Linking.openURL(`tel:${phoneNumber}`);
          } else {
            setAlert({ message: 'Call permission is required to make calls.', type: 'alert' });
          }
        });
      }
    });
  };

  // Debounce effect to delay API call by 3 seconds
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter(filter);
    }, 2000);

    return () => {
      clearTimeout(handler);
    };
  }, [filter]);

  useEffect(() => {
    if (isSuccess) {
      setCustomers(data.data);
    }
  }, [isSuccess, data]);

  const renderCard = ({ item }: { item: GetUserDto }) => (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        {item.dp ? (
          <Image style={styles.image} source={{ uri: item.dp }} />
        ) : (
          <TouchableOpacity style={{ padding: 10 }}>
            <Fontisto name="person" size={40} color="grey" />
          </TouchableOpacity>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.usernameText}>{`${item.username.toUpperCase()} - ${item.role.toUpperCase()}`}</Text>
          <Text style={styles.mobileText}>Mobile: {item.mobile || "Mobile Not available"}</Text>
        </View>
        <TouchableOpacity style={styles.callButton} onPress={() => {
          requestCallPermissionAndCall(item.mobile)
        }}>
          <MaterialIcons name="add-call" size={30} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
      <View style={styles.titleContainer}>
        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 30, textTransform: 'uppercase', letterSpacing: 1.2 }}>{routedata.company || 'Company'}</Text>
        {routedata.address && <Text style={{ textAlign: 'center', color: 'grey', padding: 5 }}>{routedata.address || ''}</Text>}
      </View>
      <View style={styles.topbar}>
        <TextInput
          style={styles.input}
          placeholder="Search Members..."
          placeholderTextColor="#888"
          value={filter}
          autoFocus
          onChangeText={(val) => setFilter(val)}
          clearButtonMode="while-editing"
        />
        <TouchableOpacity>
          <MaterialIcons name="search" size={24} color="grey" />
        </TouchableOpacity>
      </View>
      {isLoading ? <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading Customers...</Text>
      </View> :
        <>
          {customers && customers.length > 0 && (
            <FlatList
              data={customers}
              keyExtractor={(item) => item._id}
              renderItem={renderCard}
              refreshing={refreshing}
              onRefresh={onRefresh}
              ListEmptyComponent={<Text style={styles.emptyText}>No customers found.</Text>}
            />
          )}
        </>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  titleContainer: {
    padding: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  cardContainer: {
    marginVertical: 1,
    paddingHorizontal: 4,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  usernameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  mobileText: {
    fontSize: 13,
    color: 'grey',
  },
  callButton: {
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 8,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
