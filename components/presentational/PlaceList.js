/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {SafeAreaView, ScrollView, StatusBar} from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import PplButton from './PplButton';

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
      let response = await fetch('http://192.168.1.6:1337/places');
      let json = await response.json();
      setPlaces(json);
    } catch (e) {}
  }

  function handlePress(place) {
    navigation.navigate('PlaceDetails', {p: place});
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
            uri: `http://192.168.1.6:1337${p.profile_image.url}`,
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
          <PplButton population={p.population} />
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
