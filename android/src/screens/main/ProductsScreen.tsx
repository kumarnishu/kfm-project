import React, { useContext, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { ActivityIndicator, FlatList, Image, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { UserContext } from '../../contexts/UserContext';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { AxiosResponse } from 'axios';
import FuzzySearch from 'fuzzy-search';
import { useQuery } from 'react-query';
import { BackendError } from '../../..';
import { RegisteredProductService } from '../../services/RegisteredProductService';
import CreateOrEditRegisteredProductDialog from '../../components/dialogs/products/CreateOrEditRegisteredProductDialog';
import moment from 'moment';
import NewServiceRequestsDialog from '../../components/dialogs/service requests/NewServiceRequestsDialog';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GetRegisteredProductDto } from '../../dtos/RegisteredProducDto';
import SelectWithRadioButtonPickerDialog from '../../components/dialogs/picker/SelectWithRadioButtonPickerDialog';
import { DropDownDto } from '../../dtos/DropDownDto';
import { AlertContext } from '../../contexts/AlertContext';
import { isvalidDate } from '../../utils/datesHelper';

type Props = StackScreenProps<AuthenticatedStackParamList, 'ProductsScreen'>;

const ProductsScreen: React.FC<Props> = ({ navigation }) => {
  const [products, setProducts] = useState<GetRegisteredProductDto[]>([]);
  const [dialog, setDialog] = useState<string>();
  const [type, setType] = useState<DropDownDto>()
  const [types, setTypes] = useState<DropDownDto[]>([])
  const [product, setProduct] = useState<GetRegisteredProductDto>();
  const [prefilteredProducts, setPrefilteredProducts] = useState<GetRegisteredProductDto[]>([]);
  const [refreshing, setRefreshing] = useState(false); // State for pull-to-refresh
  const { user } = useContext(UserContext);

  const [filter, setFilter] = useState<string | undefined>();
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetRegisteredProductDto[]>, BackendError>(["products"], async () => new RegisteredProductService().GetAllRegisteredProducts());

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    let _types: DropDownDto[] = []
    //@ts-ignore
    if (product) {
      !isvalidDate(new Date(product && product?.installationDate)) && _types.push({ id: 'installation', label: 'Installation Request' })
      _types.push({ id: 'service', label: 'Service Request' })
      _types.push({ id: 'amc', label: 'AMC' })
      _types.push({ id: 'walk_in', label: 'Walk In' })
      setTypes(_types)
    }
  }, [product])
  

  useEffect(() => {
    if (filter) {
      const searcher = new FuzzySearch(products, ['slno', 'machine', 'customer'], {
        caseSensitive: false,
      });
      const result = searcher.search(filter);
      setProducts(result);
    }
    if (!filter)
      setProducts(prefilteredProducts);
  }, [filter]);


  useEffect(() => {
    if (isSuccess) {
      setProducts(data.data);
      setPrefilteredProducts(data.data);
    }
  }, [isSuccess, data]);

  // Render each product as a card
  const renderCard = ({ item }: { item: GetRegisteredProductDto }) => (
    <View style={styles.card}>
      <Text style={[styles.subtitle, { padding: 5, textTransform: 'uppercase', backgroundColor: 'whitesmoke', marginBottom: 0 }]}>{item.customer.label}</Text>
      <View style={styles.cardContent}>
        <Image style={styles.image} source={item.machine_photo !== "" ? { uri: item.machine_photo } : require("../../assets/img/placeholder.png")} />
        <View style={styles.textContainer}>
          <Text style={[styles.label, { fontWeight: 'bold', fontSize: 18 }]}>{item.sl_no}</Text>
          <Text style={[styles.label, { fontWeight: 'bold', paddingVertical: 5 }]}>{item.machine.label}</Text>
          <Text style={styles.label}>Installation Date</Text>
          <Text style={styles.paragraph}>{item.installationDate ? `${moment(item.installationDate).format("DD-MM-YYYY")}` : 'Not Installed'}</Text>
          <Text style={styles.label}>Warranty upto</Text>
          <Text style={styles.paragraph}>{item.warrantyUpto ? `${moment(item.warrantyUpto).format("DD-MM-YYYY")}` : 'Not In Warranty'}</Text>
          <Text style={styles.label}>AMC upto</Text>
          <Text style={styles.paragraph}>{item.amcUpto ? `${moment(item.amcUpto).format("DD-MM-YYYY")}` : 'Not In AMC'}</Text>
          {user?.role == "admin" && (
            <TouchableOpacity onPress={() => {
              setProduct(item);
              setDialog('CreateOrEditRegisteredProductDialog');
            }}>
              <Text style={styles.editButton}>Edit Product</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableOpacity
        style={[styles.serviceRequestButton]}
        onPress={() => {
          setProduct(item);
          setDialog('SelectWithRadioButtonPickerDialog');
        }}
      >
        <Text style={styles.serviceRequestButtonText}>Create Service Request</Text>
      </TouchableOpacity>
    </View>
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
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <View style={styles.topbar}>
        <Text style={styles.title}>Registered Products</Text>
        {user?.role == "admin" && (
          <MaterialIcons
            name="add-circle"
            size={50}
            color="red"
            onPress={() => {
              setProduct(undefined);
              setDialog('CreateOrEditRegisteredProductDialog');
            }}
          />
        )}
      </View>
      <View style={styles.container}>
        <TextInput placeholder='Search' style={styles.searchInput} onChangeText={(val) => setFilter(val)} />

        {/* Product List */}
        {products && (
          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            renderItem={renderCard}
            refreshing={refreshing} // Indicates if the list is refreshing
            onRefresh={onRefresh} // Handler for pull-to-refresh
            ListEmptyComponent={
              <Text style={styles.emptyText}>No products found.</Text>
            }
          />
        )}

        <CreateOrEditRegisteredProductDialog product={product} dialog={dialog} setDialog={setDialog} />
        {type && <NewServiceRequestsDialog type={type} product={product} dialog={dialog} setDialog={setDialog} />}
        <SelectWithRadioButtonPickerDialog options={types} value={type} setValue={setType} dialog={dialog} setDialog={setDialog} />
      </View>
    </>

  );
};

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 2
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  searchInput: {
    backgroundColor: 'white',
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    paddingLeft: 10,
    fontSize: 16,
    borderRadius: 2
  },
  card: {
    backgroundColor: 'white',
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow offset
    shadowOpacity: 0.2, // iOS shadow opacity
    shadowRadius: 4, // iOS shadow radius
    overflow: 'hidden', // Prevent content from overflowing rounded corners
  },
  cardContent: {
    flexDirection: 'row',
  },
  image: {
    width: 220,
    borderColor: '#ddd', // Light border
    borderWidth: 1,
    marginRight: 15,
  },
  textContainer: {
    paddingBottom: 5
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#333',
    paddingLeft: 10,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    marginLeft: 5,
    padding: 10,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  companyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    paddingLeft: 10,
    marginBottom: 8,
    textTransform: 'uppercase'
  },
  label: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  paragraph: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  editButton: {
    color: 'green',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 15,
    textAlign: 'left',
  },
  serviceRequestButton: {
    padding: 15,
    backgroundColor: 'red',
  },
  serviceRequestButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  disabledButtonText: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
  },
  disabledButton: {
    backgroundColor: 'whitesmoke',
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

export default ProductsScreen;