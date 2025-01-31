import React, { useContext, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Text, ActivityIndicator, FlatList, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { AuthenticatedStackParamList } from '../../navigation/AppNavigator';
import { useQuery } from 'react-query';
import { AxiosResponse } from 'axios';
import FuzzySearch from 'fuzzy-search';
import { BackendError } from '../../..';
import { EngineerServices } from '../../services/EngineerServices';
import { UserContext } from '../../contexts/UserContext';
import CreateOrEditEngineerDialog from '../../components/dialogs/engineers/CreateOrEditEngineerDialog';
import { toTitleCase } from '../../utils/toTitleCase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { GetUserDto } from '../../dtos/UserDto';




type Props = StackScreenProps<AuthenticatedStackParamList, 'EngineersScreen'>;

const EngineersScreen: React.FC<Props> = ({ navigation }) => {
  const [dialog, setDialog] = useState<string>();
  const { user } = useContext(UserContext);
  const [engineers, setEngineers] = useState<GetUserDto[]>([]);
  const [engineer, setEngineer] = useState<GetUserDto>();
  const [prefilteredEngineers, setPrefilteredEngineers] = useState<GetUserDto[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string | undefined>();
  const { data, isSuccess, isLoading, refetch, isError } = useQuery<AxiosResponse<GetUserDto[]>, BackendError>(["engineers"], async () => new EngineerServices().GetAllEngineers());

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
      setEngineers(result);
    }
    if (!filter) setEngineers(prefilteredEngineers);
  }, [filter]);

  useEffect(() => {
    if (isSuccess) {
      setEngineers(data.data);
      setPrefilteredEngineers(data.data);
    }
  }, [isSuccess, data]);

  const renderCard = ({ item }: { item: GetUserDto }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => navigation.navigate('EngineerDetailsScreen', { id: item._id })}>
        <Text style={styles.cardTitle}>{item.role == "admin" ? `${item.username.toUpperCase()}-(Admin)` : `${item.username.toUpperCase()}-(Engineer)` || `Member ${item.username.toUpperCase()}`}</Text>
        <Text>{`Email: ${item.email || "Not available"}`}</Text>
        <Text>{`${toTitleCase(item.customer.label || "Not available")}`}</Text>
        <Text style={{ color: 'grey' }}>Mobile: {item.mobile || "Not available"}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.editButton} onPress={() => {
        setEngineer(item);
        setDialog('CreateOrEditEngineerDialog');
      }}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  );

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
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.title}>Engineers</Text>
        {user?.role == "admin" && (
          <MaterialIcons
            name="add-circle"
            size={40}
            color="red"
            onPress={() => {
              setEngineer(undefined);
              setDialog('CreateOrEditEngineerDialog');
            }}
          />
        )}
      </View>

      <TextInput
        placeholder='Search'
        style={styles.searchInput}
        onChangeText={(val) => setFilter(val)}
      />

      {engineers && (
        <FlatList
          data={engineers}
          keyExtractor={(item) => item._id}
          renderItem={renderCard}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListEmptyComponent={<Text style={styles.emptyText}>No engineers found.</Text>}
        />
      )}

      <CreateOrEditEngineerDialog engineer={engineer} dialog={dialog} setDialog={setDialog} customer={user?.customer.id || ""} />
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
  },
  card: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  editButton: {
    marginTop: 8,
    backgroundColor: '#6200ea',
    borderRadius: 4,
    padding: 6,
  },
  editButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: '#6200ea',
    padding: 8,
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#888',
  },
  searchInput: {
    backgroundColor: 'white',
    marginBottom: 10,
    paddingHorizontal: 10,
    height: 40,
    borderRadius: 4,
    borderColor: '#ddd',
    borderWidth: 1,
  },
});

export default EngineersScreen;
