/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Animated,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import {SafeAreaView, StyleSheet, ScrollView, StatusBar} from 'react-native';
import {Picker} from '@react-native-community/picker';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';

const cities = [
  {
    value: 'Διάλεξε πόλη',
  },
  {
    value: 'Αθήνα',
  },
  {
    value: 'Θεσσαλονίκη',
  },
  {
    value: 'Πάτρα',
  },
];

const districts = [
  {
    value: 'Διάλεξε περιοχή',
  },
  {
    value: 'Κηφισιά',
  },
  {
    value: 'Ηράκλειο',
  },
  {
    value: 'Μαρούσι',
  },
];

function Test() {
  const [value, setValue] = useState('');
  const [city, setCity] = useState(cities[0].value);
  const [district, setDistrict] = useState(districts[0].value);
  const [gloc, setGloc] = useState();

  async function getCity() {
    try {
      let response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${gloc.latitude},${
          gloc.longitude
        }&pretty=1&key=f38606b7c6c34f3fa99d1efbb5c92536&q`,
      );
      let data = await response.json();
      console.log(data.results[0].components);
    } catch (err) {
      console.warn(err);
    }
  }

  async function getLocation() {
    let temp = await GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    });
    setGloc(temp);
  }

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (gloc) {
      getCity();
    }
  }, [gloc]);

  return (
    <View
      style={{
        height: '100%',
        margin: 20,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          borderColor: '#c7c7c7',
          borderWidth: 1,
          borderRadius: 100,
          margin: 10,
        }}>
        <AntDesignIcons name="search1" size={16} color="#c7c7c7" />
        <TextInput
          style={{paddingLeft: 10}}
          placeholder="Ψάξε καφετέριες, καταστήματα κτλ."
          onChangeText={text => setValue(text)}
          value={value}
        />
      </View>
      <Text
        style={{
          fontSize: 22,
          margin: 10,
          marginTop: 20,
          alignSelf: 'flex-start',
          fontWeight: '700',
        }}>
        Δεν ξέρεις τι θέλεις;
      </Text>
      <View style={{backgroundColor: '#ececec', borderRadius: 2}}>
        <Picker
          selectedValue={city}
          style={{height: 50, width: '100%'}}
          onValueChange={(itemValue, itemIndex) => {
            setCity(itemValue);
          }}>
          {cities.map((item, i) => {
            return (
              <Picker.item key={i} label={item.value} value={item.value} />
            );
          })}
        </Picker>
      </View>
      <View
        style={{backgroundColor: '#ececec', borderRadius: 2, marginTop: 10}}>
        <Picker
          selectedValue={district}
          style={{height: 50, width: '100%'}}
          onValueChange={(itemValue, itemIndex) => {
            setDistrict(itemValue);
          }}>
          {districts.map((item, i) => {
            return (
              <Picker.item key={i} label={item.value} value={item.value} />
            );
          })}
        </Picker>
      </View>

      <TouchableOpacity
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        style={{
          height: 40,
          backgroundColor: '#03a9f4',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30,
          width: 150,
          borderRadius: 100,
          alignSelf: 'center',
        }}>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
          Εφαρμογή
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default Test;
