import React, { useContext, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthenticatedStackParamList, navigate } from '../navigation/AppNavigator';
import { UserContext } from '../contexts/UserContext';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { toTitleCase } from '../utils/toTitleCase';

type Props = StackScreenProps<AuthenticatedStackParamList, 'HomeScreen'>;
type MenuItemProps = { title: string, image: any, onClick: () => void };

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [data, setData] = useState<MenuItemProps[]>([]);

  useEffect(() => {
    const TextData: MenuItemProps[] = [];
    if (user?.role == "admin" || user?.role == "engineer") {
      TextData.push({
        title: 'Customers',
        image: require('../assets/img/customers.jpg'),
        onClick: () => {
          navigate('CustomersScreen');
        },
      });
      TextData.push({
        title: 'Machines',
        image: require('../assets/img/machines.jpg'),
        onClick: () => {
          navigate('MachinesScreen');
        },
      });
    }
    if (user?.role == "admin") {
      TextData.push({
        title: 'Engineers',
        image: require('../assets/img/engineer.jpg'),
        onClick: () => {
          navigate('EngineersScreen');
        },
      });
    }
    if (user?.role == "owner") {
      TextData.push({
        title: 'Staff',
        image: require('../assets/img/staff.jpeg'),
        onClick: () => {
          navigate('StaffsScreen');
        },
      });
    }
    TextData.push({
      title: 'Products',
      image: require('../assets/img/products.jpeg'),
      onClick: () => {
        navigate('ProductsScreen');
      },
    });
    TextData.push({
      title: 'Spares',
      image: require('../assets/img/parts.jpeg'),
      onClick: () => {
        navigate('SparesScreen');
      },
    });
    TextData.push({
      title: 'Service Requests',
      image: require('../assets/img/requests.jpeg'),
      onClick: () => {
        navigate('ServiceRequestsScreen');
      },
    });
    setData(TextData);
  }, [user]);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.body}>
        <FlatList
          data={data}
          numColumns={2} // Two columns for grid layout
          keyExtractor={(item) => item.title}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => item.onClick()}>
              <Image style={styles.image} source={item.image} />
              <View style={styles.titleView}>
                <Text style={styles.titleText}>{toTitleCase(item.title)}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingVertical:10
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    marginBottom: 10,
  },
  titleView: {
    justifyContent: 'center',
    textAlign: 'center',
    paddingLeft: 5,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
