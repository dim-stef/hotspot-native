/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
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
  const [translations, setTranslations] = useState([]);

  async function getPlaces() {
    try {
      let response = await fetch(Config.API_URL + '/places');
      let json = await response.json();
      setPlaces(json);
    } catch (e) {}
  }

  async function getTranslations() {
    try {
      let response = await fetch(Config.API_URL + '/translations');
      let json = await response.json();
      console.log(json);
      setTranslations(json[0].place_type);
    } catch (e) {}
  }

  function getTranslatedType(p) {
    try {
      return translations.types.find(item => {
        return item.type === p.specific_type;
      }).translations.el;
    } catch (e) {
      return 'Αλλο';
    }
  }
  function handlePress(place) {
    navigation.navigate('PlaceDetails', {p: place});
  }

  useEffect(() => {
    getPlaces();
    getTranslations();
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
            uri: Config.API_URL + `${p.profile_image.url}`,
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
          <Text style={{fontSize: 14}}>{getTranslatedType(p)}</Text>
          <Text style={{fontSize: 12, color: 'gray'}}>
            Τελ. ενημερωση πριν{' '}
            {timeSince(new Date(p.last_assessment.created_at))}
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
  function handleFilterPress() {
    navigation.navigate('Filters');
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{height: '100%'}}>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <ViewBoxesWithColorAndText navigation={navigation} />
        </ScrollView>
        <View
          style={{
            position: 'absolute',
            bottom: 30,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={handleFilterPress}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
              backgroundColor: 'white',
              borderRadius: 100,
              shadowColor: 'black',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            <AntDesignIcons name="filter" size={16} color="black" />
            <Text style={{marginLeft: 5}}>Φίλτρα</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

function timeSince(date) {
  let seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + ' χρόνια';
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + ' μήνες';
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + ' μέρες';
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + ' ώρες';
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + ' λεπτά';
  }
  return Math.floor(seconds) + ' δευτ.';
}

export default Wrapper;
