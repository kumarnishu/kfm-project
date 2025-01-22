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
import { GetAllSpareParts } from '../../services/SparePartService';
import { formatter } from '../../utils/formatter';
import { GetSparePartDto } from '../../dto/SparePartDto';
import CreateOrEditSpareDialog from '../../components/dialogs/spares/CreateOrEditSpareDialog';
import EditSparePartsMachinesDialog from '../../components/dialogs/spares/EditSparePartsMachinesDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { toTitleCase } from '../../utils/toTitleCase';

type Props = StackScreenProps<AuthenticatedStackParamList, 'SparesScreen'>;

const SparesScreen: React.FC<Props> = ({ navigation }) => {
  const [spares, setSpares] = useState<GetSparePartDto[]>([])
  const [spare, setSpare] = useState<GetSparePartDto>()
  const [prefilteredSpares, setPrefilteredSpares] = useState<GetSparePartDto[]>([])
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const { user } = useContext(UserContext);
  const [selectedMachines, setSelectedMachines] = useState<string[]>([])
  const [dialog, setDialog] = useState<string>()
  const [filter, setFilter] = useState<string | undefined>()
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetSparePartDto[]>, BackendError>(["spares"], async () => GetAllSpareParts())

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (filter) {
      const searcher = new FuzzySearch(spares, ['name', 'partno'], {
        caseSensitive: false,
      });
      const result = searcher.search(filter);
      setSpares(result)
    }
    if (!filter)
      setSpares(prefilteredSpares)
  }, [filter])

  useEffect(() => {
    if (isSuccess) {
      setSpares(data.data)
      setPrefilteredSpares(data.data)
    }
  }, [isSuccess, data])
  // Render each engineer as a card
  const renderCard = ({ item }: { item: GetSparePartDto }) => (

    <Card style={styles.card}>
      <Title style={[styles.title, { fontSize: 18 }]}>Name : {toTitleCase(item.name || "")}</Title>
      <Card.Content style={styles.cardContent}>
        <Image style={styles.image} source={item.photo !== "" ? { uri: item.photo } : require("../../assets/img/placeholder.png")} />
        <View style={styles.textContainer}>

          <Text style={styles.paragraph}>PART NO : {item.partno}</Text>
          <Text style={styles.paragraph}>Est. Price : {item.price} rs.</Text>
          {user?.role == "admin" &&<Button mode='text' rippleColor="transparent" onPress={() => {
            setSpare(item)
            setDialog('CreateOrEditSpareDialog')
          }} labelStyle={{ width: '100%', textAlign: 'left' }}>Edit item</Button>}
        </View>
      </Card.Content>
    </Card>
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading Spares...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loader}>
        <Text>Failed to load spares. Please try again later.</Text>
        <Button mode="contained" onPress={() => refetch()}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <Surface elevation={2} style={styles.container}>

      {/* Title */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', maxWidth: 350 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', paddingBottom: 20 }}>Spares</Text>
        {user?.role == "admin" &&
          <MaterialIcons
            name="add-circle"
            size={40}
            color="red"
            onPress={() => {
              setSpare(undefined)
              setDialog('CreateOrEditSpareDialog')
            }}
          />
        }
      </View>
      <TextInput mode="flat" placeholder='Search' style={{ backgroundColor: 'white', marginBottom: 10 }} onChangeText={(val) => setFilter(val)} />


      {/* Engineer List */}
      {spares && <FlatList
        data={spares}
        keyExtractor={(item) => item._id}
        renderItem={renderCard}
        refreshing={refreshing} // Indicates if the list is refreshing
        onRefresh={onRefresh} // Handler for pull-to-refresh
        ListEmptyComponent={
          <Text style={styles.emptyText}>No spares found.</Text>
        }
      />}
      {spare && <EditSparePartsMachinesDialog selectedMachines={selectedMachines} setSelectedMachines={setSelectedMachines} part={spare} dialog={dialog} setDialog={setDialog} />}
      <CreateOrEditSpareDialog part={spare} dialog={dialog} setDialog={setDialog} />
    </Surface>
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
    paddingLeft: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
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

export default SparesScreen;
