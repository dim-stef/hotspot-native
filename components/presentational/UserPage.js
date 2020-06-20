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
  return userContext.isAuth ? (
    <AuthenticatedUserPage navigation={navigation} />
  ) : (
    <Login navigation={navigation} />
  );
}
//folder1
function AuthenticatedUserPage({navigation}) {
  const userContext = useContext(UserContext);

  function handleApplicationClick() {
    navigation.navigate('Application');
  }

  return (
    <View style={{padding: 10}}>
      {/*<Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          borderBottomWidth: 1,
          paddingTop: 5,
          paddingBottom: 5,
        }}>
        Οι πληροφορίες μου
      </Text>*/}
      <UserSetting title="Τα μέρη μου" icon="folder1" />
      <UserSetting
        title="Σου ανήκει μέρος;"
        icon="pluscircleo"
        action={handleApplicationClick}
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
