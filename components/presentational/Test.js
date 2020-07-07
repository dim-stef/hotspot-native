/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';

function Test({navigation}) {
  const [value, setValue] = useState('');
  const [gloc, setGloc] = useState();
  const [results, setResults] = useState([]);
  const [city, setCity] = useState();

  async function getCity() {
    try {
      let response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${gloc.latitude},${
          gloc.longitude
        }&pretty=1&key=f38606b7c6c34f3fa99d1efbb5c92536&q`,
      );
      let data = await response.json();
      console.log(data.results[0].components.suburb);
      setCity(data.results[0].components.suburb);
      console.log(city);
    } catch (err) {
      console.warn(err);
    }
  }

  async function getLocation() {
    let granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'GIMME UR LOCATION NIBBA',
        message: 'I would like to know wher u sleep in order to kill u',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      let temp = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });
      setGloc(temp);
    } else {
      console.log('Permmision Denied');
    }
  }

  async function getSearchResults() {
    try {
      let response = await fetch(
        Config.API_URL + `/places?name_contains=${value}`,
      );
      let data = await response.json();
      setResults(data);
    } catch (err) {
      console.warn(err);
    }
  }

  function handleResultPress(place) {
    navigation.navigate('PlaceDetails', {p: place});
  }

  useEffect(() => {
    getSearchResults();
  }, [value]);

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    if (gloc) {
      getCity();
    }
  }, [getCity, gloc]);

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
      {results.map((p, i) => {
        return (
          <TouchableOpacity
            onPress={() => handleResultPress(p)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginLeft: 30,
              marginRight: 30,
              marginTop: 10,
              paddingBottom: 10,
              borderBottomColor: '#eaecef',
              borderBottomWidth: results.length - 1 === i ? 0 : 1,
            }}>
            {p.profile_image ? (
              <Image
                source={{
                  uri: Config.API_URL + `${p.profile_image.url}`,
                }}
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 100,
                  shadowColor: 'black',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              />
            ) : (
              <View
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 100,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: 'black',
                  backgroundColor: '#f3f3f3',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <Text>{p.name.charAt(0).toUpperCase()}</Text>
              </View>
            )}

            <Text style={{marginLeft: 30, fontSize: 16}}>{p.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default Test;
