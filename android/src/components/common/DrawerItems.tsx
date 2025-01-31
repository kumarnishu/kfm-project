import { View, Image, StyleSheet, FlatList, Text, Button, TouchableOpacity } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { toTitleCase } from '../../utils/toTitleCase';
import { UserService } from '../../services/UserService';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { replaceScreen } from '../../navigation/AppNavigator';

type MenuItemProps = { title: string, image: any, onClick: () => void }

const DrawerItems = ({ visible, setVisible }: { visible: boolean, setVisible: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { user, setUser } = useContext(UserContext);
    const [data, setData] = useState<MenuItemProps[]>([])

    const handleLogout = useCallback(async () => {
        try {
            await new UserService().Logout();
            setUser(undefined);
        } catch (err) {
            console.error("Logout failed:", err);
        }
    }, [setUser]);

    useEffect(() => {
        const TextData: MenuItemProps[] = []

        TextData.push({
            title: 'Dashboard',
            image: require('../../assets/img/home.png'),
            onClick: () => {
                replaceScreen('HomeScreen')
                setVisible(!visible)
            },
        })
        setData(TextData);
    }, [user, visible]);

    return (
        <View style={styles.container}>
            <View style={styles.topbar}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    {user?.dp &&
                        <Image source={{ uri: user.dp }} style={styles.picture} />}
                    <Text style={styles.logoText}>
                        {toTitleCase(user?.username || "Home")}
                    </Text>
                </View>

                <View style={{ marginRight: 30, borderWidth: 2 }}>
                    <MaterialIcons
                        name="close"
                        size={30}
                        color="grey"
                        onPress={() => {
                            setVisible(!visible)
                        }}
                    />
                </View>
            </View>
            <View style={styles.body}>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.title}
                    renderItem={({ item }) => (
                        <Text style={styles.card} onPress={() => item.onClick()}>
                            <Image style={styles.image} source={item.image} />
                            <View style={styles.titleView}>
                                <Text style={{ fontSize: 20 }} >{toTitleCase(item.title)}</Text>
                            </View>
                        </Text>
                    )}
                />
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#f4f4f4',  // Light background for better contrast
    },
    body: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        elevation: 3, // For Android shadow effect
        shadowColor: '#000', // For iOS shadow effect
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    picture: {
        width: 50,
        height: 50,
        borderRadius: 60 / 2,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    logoText: {
        color: '#333',
        fontSize: 22,
        fontWeight: 'bold',
        marginLeft: 15,
    },
    card: {
        marginVertical: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        justifyContent: 'space-between',
        elevation: 2,  // Android shadow
    },
    image: {
        width: 35,
        height: 35,
        borderRadius: 20,
        marginRight: 15,
    },
    titleView: {
        justifyContent: 'center',
        textAlign: 'center',
        paddingLeft: 10
    },
    logoutButton: {
        backgroundColor: 'red',
        paddingVertical: 12,
        borderRadius: 8,
        width: '85%',
        alignItems: 'center',
        margin: 10
    },
    logoutText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
});


export default DrawerItems;