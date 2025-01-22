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
import { GetAllRegisteredProducts } from '../../services/RegisteredProductService';
import { GetRegisteredProductDto } from '../../dto/RegisteredProducDto';
import CreateOrEditRegisteredProductDialog from '../../components/dialogs/products/CreateOrEditRegisteredProductDialog';
import moment from 'moment';
import NewServiceRequestsDialog from '../../components/dialogs/service requests/NewServiceRequestsDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = StackScreenProps<AuthenticatedStackParamList, 'ProductsScreen'>;

const ProductsScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<GetRegisteredProductDto[]>([])
  const [dialog, setDialog] = useState<string>()
  const [product, setProduct] = useState<GetRegisteredProductDto>()
  const [prefilteredProducts, setPrefilteredProducts] = useState<GetRegisteredProductDto[]>([])
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const { user } = useContext(UserContext);

  const [filter, setFilter] = useState<string | undefined>()
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetRegisteredProductDto[]>, BackendError>(["products"], async () => GetAllRegisteredProducts())

  console.log(products)
  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    if (filter) {
      const searcher = new FuzzySearch(products, ['slno', 'machine', 'customer'], {
        caseSensitive: false,
      });
      const result = searcher.search(filter);
      setProducts(result)
    }
    if (!filter)
      setProducts(prefilteredProducts)
  }, [filter])

  useEffect(() => {
    if (isSuccess) {
      setProducts(data.data)
      setPrefilteredProducts(data.data)
    }
  }, [isSuccess, data])
  // Render each engineer as a card
  const renderCard = ({ item }: { item: GetRegisteredProductDto }) => (

    <Card style={styles.card}>
      <Title style={styles.subtitle}>Sl.No.{item.sl_no}     Machine : {item.machine.label}</Title>

      <Card.Content style={styles.cardContent}>
        <View>
          <Image style={styles.image} source={item.machine_photo !== "" ? { uri: item.machine_photo } : require("../../assets/img/placeholder.png")} />
        </View>
        <View style={styles.textContainer}>

          <Paragraph style={[styles.subtitle, { paddingLeft: 0 }]}>{item.customer.label}</Paragraph>
          <Paragraph style={styles.paragraph}>{item.installationDate ? `Installation Date : ${moment(item.installationDate).format("DD-MM-YYYY")}` : 'Not Installed'}</Paragraph>
          <Paragraph style={styles.paragraph}>{item.warrantyUpto ? `Warranty upto : ${moment(item.warrantyUpto).format("DD-MM-YYYY")}` : 'Not Applicable'}</Paragraph>
          {user?.role == "admin" &&<Button mode='text' rippleColor="transparent" onPress={() => {
            setProduct(item)
            setDialog('CreateOrEditRegisteredProductDialog')
          }} labelStyle={{ width: '100%', textAlign: 'left' }}>Edit item</Button>}
        </View>

      </Card.Content>
      <Button
        disabled={item?.warrantyUpto && new Date(item.warrantyUpto) <= new Date() ? true : false} onPress={() => {
          setProduct(item)
          setDialog('NewServiceRequestsDialog')
        }} labelStyle={{ width: '100%', textAlign: 'left', paddingLeft: 15 }}>New Service Request</Button>
    </Card>
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text>Loading Products...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loader}>
        <Text>Failed to load products. Please try again later.</Text>
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
        <Text style={styles.title}>Registered Products</Text>
        {user?.role == "admin" &&
          <MaterialIcons
            name="add-circle"
            size={40}
            color="red"
            onPress={() => {
              setProduct(undefined)
              setDialog('CreateOrEditRegisteredProductDialog')
            }}
          />
        }
      </View>
     <TextInput mode="flat" placeholder='Search' style={{ backgroundColor: 'white', marginBottom: 10 }} onChangeText={(val) => setFilter(val)} />


      {/* Engineer List */}
      {products && <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={renderCard}
        refreshing={refreshing} // Indicates if the list is refreshing
        onRefresh={onRefresh} // Handler for pull-to-refresh
        ListEmptyComponent={
          <Text style={styles.emptyText}>No products found.</Text>
        }
      />}

      <CreateOrEditRegisteredProductDialog product={product} dialog={dialog} setDialog={setDialog} />
      <NewServiceRequestsDialog product={product} dialog={dialog} setDialog={setDialog} />
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
export default ProductsScreen;
