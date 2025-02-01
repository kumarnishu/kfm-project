import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, Text, Button, TextInput, TouchableOpacity, Image, Linking } from 'react-native';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import { BackendError } from '../../..';
import { CustomerService } from '../../services/CustomerService';
import { GetUserDto } from '../../dtos/UserDto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { AlertContext } from '../../contexts/AlertContext';

const CustomerDetailsScreen = ({ route, navigation }) => {
  const { id, data: routedata } = route.params;
  const { setAlert } = useContext(AlertContext);
  const [customers, setCustomers] = useState<GetUserDto[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | undefined>();
  const [debouncedFilter, setDebouncedFilter] = useState<string | undefined>();
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>([
    "users", id, debouncedFilter
  ], async () => new CustomerService().GetAllCustomersStaffForAdmin({ id: String(id), search: debouncedFilter }));

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

  const openWhatsApp = async (phoneNumber, message) => {
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    const supported = await Linking.canOpenURL(url);   
    if (supported)
      await Linking.openURL(url);
    else
      setAlert({ message: 'Could not Open WhatsApp' })
  };

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

  const renderCard = ({ item }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardRow}>
        {item.dp ? (
          <Image style={styles.image} source={{ uri: item.dp }} />
        ) : (
          <TouchableOpacity style={{ paddingRight: 10 }}>
            <Fontisto name="person" size={45} color="grey" />
          </TouchableOpacity>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.usernameText}>{`${item.username.toUpperCase()} - ${item.role.toUpperCase()}`}</Text>
          <Text style={styles.mobileText}>Mobile: {item.mobile || "Mobile Not available"}</Text>
        </View>
      </View>
      <View style={styles.cardAction}>
        <TouchableOpacity style={styles.callButton} onPress={() => requestCallPermissionAndCall(item.mobile)}>
          <MaterialIcons name="add-call" size={24} color="white" />
          <Text style={{ color: 'white' }}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.whatsappButton} onPress={() => {
          openWhatsApp(`91${item.mobile}`, 'Hi Dear,')
        }
        }>
          <FontAwesome name="whatsapp" size={24} color="white" />
          <Text style={{ color: 'white' }}>Whatsapp</Text>
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
        <Text style={styles.companyTitle}>{routedata.company || 'Company'}</Text>
        {routedata.address && <Text style={styles.companyAddress}>{routedata.address || ''}</Text>}
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
      {isLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#6200ea" />
          <Text>Loading Customers...</Text>
        </View>
      ) : (
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
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  companyTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 24,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#333',
  },
  companyAddress: {
    textAlign: 'center',
    fontSize: 14,
    color: 'grey',
    padding: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  cardContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    marginTop: 4,
    borderRadius: 12,
    elevation: 3,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    gap: 10
  },
  cardAction: {
    flexDirection: 'row',
    paddingTop: 10,
    marginLeft: '5%',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  usernameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  mobileText: {
    fontSize: 14,
    color: 'grey',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callButton: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#007bff',
    padding: 8,
    width: '38%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  whatsappButton: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#25D366',
    padding: 8,
    width: '38%',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topbar: {
    flexDirection: 'row',
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
