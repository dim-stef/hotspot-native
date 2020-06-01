/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableNativeFeedback,
} from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import Ripple from 'react-native-material-ripple';

function Search({navigation, ...rest}) {
  console.log(rest);
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Search')}
      style={{
        borderRadius: 100,
        padding: 10,
        backgroundColor: 'white',
        margin: 10,
        shadowColor: 'black',
      }}>
      <AntDesignIcons name="search1" size={26} color="black" />
    </TouchableOpacity>
  );
}

export default Search;
