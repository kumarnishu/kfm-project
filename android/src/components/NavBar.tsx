import { View, Image, StyleSheet } from 'react-native';
import React, { useCallback, useContext, useState } from 'react';
import { Button, Divider, Menu, Text } from 'react-native-paper';
import { UserContext } from '../contexts/UserContext';
import { Logout } from '../services/UserService';
import { toTitleCase } from '../utils/toTitleCase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { navigate } from '../navigation/AppNavigator';

const Navbar = () => {
    const { user, setUser } = useContext(UserContext);
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const handleLogout = useCallback(async () => {
        try {
            await Logout();
            setUser(undefined);
        } catch (err) {
            console.error("Logout failed:", err);
        }
    }, [setUser]);

    return (
        <View style={styles.navContainer}>
            {/* Profile Picture or Username */}
            <View>
                {user?.dp ? (
                    <Image source={{ uri: user.dp }} style={styles.picture} />
                ) : (
                    <Text style={styles.logoText}>
                        {toTitleCase(user?.username || "Home")}
                    </Text>
                )}
            </View>

            {/* Icons Section */}
            <View style={styles.iconView}>
                {/* Notification Icon */}
                <View style={styles.notificationContainer}>
                    <MaterialIcons
                        name="notifications"
                        size={40}
                        color="white"
                        onPress={() => {
                            navigate("NotificationScreen")
                            closeMenu()
                        }}
                    />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {1}
                        </Text>
                    </View>
                </View>

                {/* Menu Icon with Dropdown */}
                <Menu
                    visible={menuVisible}
                    style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between', width: 150 }}
                    anchorPosition='bottom'
                    onDismiss={closeMenu}
                    anchor={
                        <MaterialIcons
                            name="menu"
                            size={45}
                            color="white"
                            onPress={openMenu}
                        />
                    }
                >
                    <Button mode="contained" buttonColor='whitesmoke' >
                        <Text style={{ color: 'grey' }} onPress={() => {
                            navigate("HomeScreen")
                            closeMenu()
                        }}>Home</Text>
                    </Button>
                    <Divider style={{ marginVertical: 5 }} />
                    <Button mode="text" >
                        <Text style={{ color: 'red' }} onPress={handleLogout}>Exit</Text>
                    </Button>
                </Menu>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 65,
        borderBottomWidth: 1,
        backgroundColor: 'red',
        paddingHorizontal: 10,
    },
    iconView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    picture: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderColor: 'white',
        borderWidth: 2,
    },
    logoText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    notificationContainer: {
        position: 'relative',
        marginRight: 15,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'yellow',
        borderRadius: 10,
        minWidth: 15,
        minHeight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    badgeText: {
        color: 'black',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

export default Navbar;
