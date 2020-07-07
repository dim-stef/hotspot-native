/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {UserContext} from '../Context';
import Login from './Login';

function UserPage({navigation}) {
  const userContext = useContext(UserContext);
  console.log(userContext.isAuth);
  return userContext.isAuth ? (
    <AuthenticatedUserPage navigation={navigation} />
  ) : (
    <Login navigation={navigation} />
  );
}

function AuthenticatedUserPage({navigation}) {
  const [loadingButton, setLoadingButton] = useState(null);
  const userContext = useContext(UserContext);

  function handleApplicationClick() {
    navigation.navigate('Application');
  }

  function handleMyPlacesClick() {
    navigation.navigate('MyPlaces');
  }

  async function handleClick() {
    try {
      await AsyncStorage.removeItem('token');
    } catch (e) {
      console.log(e)
      // saving error
    }
    userContext.setAuth(null);
  }

  return (
    <View style={{padding: 10}}>
      <UserSetting
        title="Τα μέρη μου"
        icon="folder1"
        action={handleMyPlacesClick}
      />
      <UserSetting
        title="Σου ανήκει μέρος;"
        icon="pluscircleo"
        action={handleApplicationClick}
      />
      <AnimateLoadingButton
        ref={c => setLoadingButton(c)}
        width={150}
        height={50}
        title="Αποσυνδέσου"
        titleFontSize={16}
        titleColor="rgb(255,255,255)"
        backgroundColor="#0E86D4"
        borderRadius={100}
        onPress={handleClick}
      />
    </View>
  );
}

function UserSetting({action, title, icon}) {
  return (
    <TouchableOpacity
      onPress={action}
      style={{
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <AntDesignIcons
        name={icon}
        size={16}
        color="black"
        style={{paddingLeft: 10}}
      />
      <View
        style={{
          paddingTop: 20,
          paddingBottom: 20,
          paddingRight: 10,
          marginLeft: 10,
          borderBottomWidth: 1,
          borderColor: '#ededed',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{flexGrow: 1, fontSize: 15}}>{title}</Text>
        <AntDesignIcons
          name="arrowright"
          size={16}
          color="black"
          style={{paddingLeft: 10}}
        />
      </View>
    </TouchableOpacity>
  );
}

export default UserPage;
