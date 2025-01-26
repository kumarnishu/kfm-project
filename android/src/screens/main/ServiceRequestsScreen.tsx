import React, { useContext, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Button, Card, Paragraph, Surface, Text, TextInput, Title } from 'react-native-paper';
import { ActivityIndicator, FlatList, Image, StyleSheet, View } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { AxiosResponse } from 'axios';
import FuzzySearch from 'fuzzy-search';
import { useQuery } from 'react-query';
import { BackendError } from '../../..';
import moment from 'moment';
import { GetAllServiceRequests } from '../../services/ServiceRequestService';
import { GetServiceRequestDto } from '../../dto/ServiceRequestDto';

type Props = StackScreenProps<AuthenticatedStackParamList, 'ServiceRequestsScreen'>;

const ServiceRequestsScreen: React.FC<Props> = ({ navigation }) => {
  const [requests, setRequests] = useState<GetServiceRequestDto[]>([])
  const [request, setRequest] = useState<GetServiceRequestDto>()
  const [prefilteredRequests, setPrefilteredRequests] = useState<GetServiceRequestDto[]>([])
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const { user } = useContext(UserContext);

  const [filter, setFilter] = useState<string | undefined>()
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetServiceRequestDto[]>, BackendError>(["requests"], async () => GetAllServiceRequests())

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (filter) {
      const searcher = new FuzzySearch(requests, ['slno', 'machine', 'customer'], {
        caseSensitive: false,
      });
      const result = searcher.search(filter);
      setRequests(result)
    }
    if (!filter)
      setRequests(prefilteredRequests)
  }, [filter])

  useEffect(() => {
    if (isSuccess) {
      setRequests(data.data)
      setPrefilteredRequests(data.data)
    }
  }, [isSuccess, data])
  // Render each engineer as a card
  const renderCard = ({ item }: { item: GetServiceRequestDto }) => (

    <Card style={styles.card} onPress={() => {
      setRequest(item)
      request && navigation.navigate('ServiceRequestDetailsScreen', { id: item._id })
    }}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { paddingLeft: 0 }]}>{item.customer.label}</Text>
          <Text style={styles.subtitle}>ID : {item.request_id}</Text>
          {item.assigned_engineer && <Paragraph style={[styles.paragraph, { color: 'green' }]}>{item.assigned_engineer.label}</Paragraph>}
          <Text style={[styles.subtitle, { fontSize: 12 }, { color: item.assigned_engineer ? 'green' : 'red' }]}>{item.assigned_engineer ? `Approved on : ${moment(item.approved_on).format("DD-MM-YYYY")}` : 'Pending for approval'}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading Requests...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loader}>
        <Text>Failed to load requests. Please try again later.</Text>
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
        <Text style={styles.title}>Service Requests</Text>
      </View>
      <TextInput mode="flat" placeholder='Search' style={{ backgroundColor: 'white', marginBottom: 10 }} onChangeText={(val) => setFilter(val)} />


      {/* Engineer List */}
      {requests && <FlatList
        data={requests}
        keyExtractor={(item) => item._id}
        renderItem={renderCard}
        refreshing={refreshing} // Indicates if the list is refreshing
        onRefresh={onRefresh} // Handler for pull-to-refresh
        ListEmptyComponent={
          <Text style={styles.emptyText}>No requests found.</Text>
        }
      />}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12, // Rounded corners
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow offset
    shadowOpacity: 0.2, // iOS shadow opacity
    shadowRadius: 4, // iOS shadow radius
    overflow: 'hidden', // Prevent content from overflowing rounded corners
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16, // Add padding inside the card
  },
  image: {
    width: 150,
    height: 200,
    borderRadius: 8, // Rounded image corners
    borderColor: '#ddd', // Light border
    borderWidth: 1,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    paddingLeft: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
  },
  button: {
    alignSelf: 'flex-end',
    marginTop: 8,
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
export default ServiceRequestsScreen;
