/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import Ripple from 'react-native-material-ripple';

function User({navigation, ...rest}) {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Login')}
      style={{
        borderRadius: 100,
        padding: 10,
        backgroundColor: 'white',
        margin: 10,
        shadowColor: 'black',
      }}>
      <AntDesignIcons name="user" size={26} color="black" />
    </TouchableOpacity>
  );
}

export default User;
