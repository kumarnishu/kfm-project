import React, { useContext, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { ActivityIndicator, FlatList, Image, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { AxiosResponse } from 'axios';
import FuzzySearch from 'fuzzy-search';
import { useQuery } from 'react-query';
import { BackendError } from '../../..';
import { MachineService } from '../../services/MachineService';
import CreateOrEditMachineDialog from '../../components/dialogs/machines/CreateOrEditMachineDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GetMachineDto } from '../../dtos/MachineDto';

type Props = StackScreenProps<AuthenticatedStackParamList, 'MachinesScreen'>;

const MachinesScreen: React.FC<Props> = ({ navigation }) => {
  const [machines, setMachines] = useState<GetMachineDto[]>([])
  const [machine, setMachine] = useState<GetMachineDto>()
  const [dialog, setDialog] = useState<string>()
  const [prefilteredMachines, setPrefilteredMachines] = useState<GetMachineDto[]>([])
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const { user } = useContext(UserContext);

  const [filter, setFilter] = useState<string | undefined>()
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetMachineDto[]>, BackendError>(["machines"], async () => new MachineService().GetAllMachines())

  console.log(machines)
  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (filter) {
      const searcher = new FuzzySearch(machines, ['name', 'model'], {
        caseSensitive: false,
      });
      const result = searcher.search(filter);
      setMachines(result)
    }
    if (!filter)
      setMachines(prefilteredMachines)
  }, [filter])

  useEffect(() => {
    if (isSuccess) {
      setMachines(data.data)
      setPrefilteredMachines(data.data)
    }
  }, [isSuccess, data])
  // Render each engineer as a card
  const renderCard = ({ item }: { item: GetMachineDto }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Image style={styles.image} source={item.photo !== "" ? { uri: item.photo } : require("../../assets/img/placeholder.png")} />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { paddingLeft: 0 }]}>Name : {item.name}</Text>
          <Text style={styles.paragraph}>Model No : {item.model}</Text>
          {user?.role == "admin" && <TouchableOpacity onPress={() => {
            setMachine(item)
            setDialog('CreateOrEditMachineDialog')
          }}>
            <Text style={styles.editButton}>Edit Item</Text>
          </TouchableOpacity>}
        </View>
      </View>
    </View>
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading Machines...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loader}>
        <Text>Failed to load machines. Please try again later.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: 350 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', paddingBottom: 20 }}>Machines</Text>
        {user?.role == "admin" &&
          <MaterialIcons
            name="add-circle"
            size={40}
            color="red"
            onPress={() => {
              setMachine(undefined)
              setDialog('CreateOrEditMachineDialog')
            }}
          />
        }
      </View>
      <TextInput placeholder='Search' style={{ backgroundColor: 'white', marginBottom: 10, padding: 10 }} onChangeText={(val) => setFilter(val)} />

      {/* Engineer List */}
      {machines && <FlatList
        data={machines}
        keyExtractor={(item) => item._id}
        renderItem={renderCard}
        refreshing={refreshing} // Indicates if the list is refreshing
        onRefresh={onRefresh} // Handler for pull-to-refresh
        ListEmptyComponent={
          <Text style={styles.emptyText}>No machines found.</Text>
        }
      />}

      <CreateOrEditMachineDialog machine={machine} dialog={dialog} setDialog={setDialog} />
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
    paddingLeft: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    paddingLeft: 10,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  editButton: {
    color: '#6200ea',
    fontSize: 16,
    textAlign: 'left',
    marginTop: 8,
  },
  retryButton: {
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
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

export default MachinesScreen;