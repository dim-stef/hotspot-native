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
import FeatherIcons from 'react-native-vector-icons/Feather';
import Ripple from 'react-native-material-ripple';

function PlaceSettingsButton({navigation, ...rest}) {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('PlaceSettings')}
      style={{
        borderRadius: 100,
        padding: 10,
        backgroundColor: 'white',
        margin: 10,
        shadowColor: 'black',
      }}>
      <FeatherIcons name="settings" size={26} color="black" />
    </TouchableOpacity>
  );
}

export default PlaceSettingsButton;
