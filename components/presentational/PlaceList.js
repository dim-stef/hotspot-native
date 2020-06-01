/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {SafeAreaView, StyleSheet, ScrollView, StatusBar} from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';

const COLORS = {
  backgroundLow: '#4caf5096',
  backgroundMedium: '#03a9f45e',
  backgroundHigh: '#f403035e',
  textLow: 'green',
  textMedium: '#03a9f4',
  textHigh: '#f44336',
};

const specificType = [
  {
    gr: 'Εστιατόριο',
    en: 'restaurant',
  },
  {
    gr: 'Καφετέρια',
    en: 'cafeteria',
  },
];
const ViewBoxesWithColorAndText = ({navigation}) => {
  const [places, setPlaces] = useState([]);

  async function getPlaces() {
    try {
      let response = await fetch('http://192.168.2.5:1337/places');
      let json = await response.json();
      setPlaces(json);
      console.log(json);
    } catch (e) {
      console.log(e);
    }
  }

  function handlePress(place) {
    navigation.navigate('PlaceDetails');
  }

  useEffect(() => {
    getPlaces();
  }, []);
  return places.map((p, i) => {
    return (
      <TouchableOpacity
        onPress={() => handlePress(p)}
        key={i}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 100,
          padding: 20,
          backgroundColor: 'white',
          borderRadius: 10,
          margin: 10,
          shadowColor: 'black',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <Image
          source={{
            uri: `http://192.168.2.3:1337${p.profile_image.url}`,
          }}
          style={{
            height: 60,
            width: 60,
            borderRadius: 100,
            backgroundColor: 'white',
          }}
        />
        <View style={{marginLeft: 10}}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>{p.name}</Text>
          <Text style={{fontSize: 14}}>
            {specificType.find(type => type.en === p.specific_type).gr ||
              'Άλλο'}
          </Text>
          <Text style={{fontSize: 12, color: 'gray'}}>
            Τελ. ενημερωση πριν 1 ωρες
          </Text>
        </View>
        <View style={{flexGrow: 1, marginLeft: 10, alignItems: 'center'}}>
          <Text style={{fontSize: 12, color: 'gray'}}>Κοσμος</Text>
          <View
            style={{
              backgroundColor:
                p.population === 'low'
                  ? COLORS.backgroundLow
                  : p.population === 'medium'
                  ? COLORS.backgroundMedium
                  : COLORS.backgroundHigh,
              flexGrow: 1,
              borderRadius: 5,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                color:
                  p.population === 'low'
                    ? COLORS.textLow
                    : p.population === 'medium'
                    ? COLORS.textMedium
                    : COLORS.textHigh,
              }}>
              {p.population === 'low'
                ? 'Λίγος'
                : p.population === 'medium'
                ? 'Μεσαίος'
                : 'Πολύς'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  });
};

function Search({navigation}) {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('Search')}
      style={{
        padding: 10,
        position: 'absolute',
        bottom: 30,
        right: 10,
        backgroundColor: 'white',
        borderRadius: 100,
        margin: 10,
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      <AntDesignIcons name="search1" size={26} color="black" />
    </TouchableOpacity>
  );
}

const Wrapper = ({navigation}) => {
  useEffect(() => {
    console.log('mount');
  }, []);
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{height: '100%'}}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <ViewBoxesWithColorAndText navigation={navigation} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Wrapper;
