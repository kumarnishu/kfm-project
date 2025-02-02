import { View, Image, StyleSheet, Text } from 'react-native';
import React, { useCallback, useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { toTitleCase } from '../../utils/toTitleCase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { navigate } from '../../navigation/AppNavigator';
import { UserService } from '../../services/UserService';

const Navbar = () => {
    const { user, setUser } = useContext(UserContext);
    const handleLogout = useCallback(async () => {
        try {
            await new UserService().Logout();
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
                        {`Hi,` + toTitleCase(user?.username || "Home")}
                    </Text>
                )}
            </View>

            {/* Icons Section */}
            <View style={styles.iconView}>
                {/* Notification Icon */}
                <View style={styles.notificationContainer}>
                    <MaterialIcons
                        name="notifications"
                        size={35}
                        color="white"
                        onPress={() => {
                            navigate('NotificationScreen')
                        }}
                    />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                            {1}
                        </Text>
                    </View>
                </View>

                {/* Menu Icon with Dropdown */}
                <AntDesign
                    name="poweroff"
                    size={30}
                    color="lightgrey"
                    onPress={() => handleLogout()}
                />
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
        fontSize: 24,
        paddingLeft:10,
        fontWeight: 'bold',
    },
    notificationContainer: {
        position: 'relative',
        marginRight: 25,
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'white',
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
    menu: {
        position: 'absolute',
        top: 60,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 5,
        width: 150,
        padding: 10,
    },
    menuItem: {
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    menuText: {
        color: 'grey',
    },
    logoutText: {
        color: 'red',
    },
    divider: {
        height: 1,
        backgroundColor: 'lightgrey',
        marginVertical: 5,
    },
});

export default Navbar;
