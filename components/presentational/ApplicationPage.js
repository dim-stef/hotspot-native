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

function ApplicationForm() {
  return (
    <View style={{padding: 10}}>
      <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
        Προσωπικά στοιχεία
      </Text>
      <TextInput
        placeholder="Όνομα"
        autoCompleteType="name"
        style={{borderBottomColor: '#c7c7c7', borderBottomWidth: 1}}
      />
      <TextInput
        placeholder="Επώνυμο"
        style={{borderBottomColor: '#c7c7c7', borderBottomWidth: 1}}
      />
      <TextInput
        placeholder="Email"
        autoCompleteType="email"
        style={{borderBottomColor: '#c7c7c7', borderBottomWidth: 1}}
      />
      <TextInput
        placeholder="Αριθμός τηλεφώνου"
        autoCompleteType="tel"
        style={{borderBottomColor: '#c7c7c7', borderBottomWidth: 1}}
      />
    </View>
  );
}

export default ApplicationForm;
