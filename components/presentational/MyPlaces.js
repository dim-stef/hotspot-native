/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {UserContext} from '../Context';
import {ListItem} from './PlaceList';
import SkeletonPlaceList from './SkeletonPlaceList';
import useTranslations from '../hooks/useTranslations';

function MyPlaces({navigation}) {
  const [translation, getTranslatedType] = useTranslations();
  const [places, setPlaces] = useState(null);
  const [applications, setApplications] = useState(null);
  const userContext = useContext(UserContext);

  async function getPlaces() {
    let token = null;
    try {
      token = await AsyncStorage.getItem('token');
    } catch (e) {
      // saving error
    }

    try {
      let uri = Config.API_URL + `/places?user.id=${userContext.user.id}`;
      let response = await fetch(uri, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let json = await response.json();
      setPlaces(json);
    } catch (e) {
      console.log(e);
    }
  }

  async function getApplications() {
    let token = null;
    try {
      token = await AsyncStorage.getItem('token');
    } catch (e) {
      // saving error
    }

    try {
      let uri =
        Config.API_URL +
        `/applications?user.id=${userContext.user.id}&confirmed_null=true`;
      let response = await fetch(uri, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let json = await response.json();
      setApplications(json);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getPlaces();
    getApplications();
  }, []);
  return (
    <ScrollView>
      <Text style={{fontSize: 20, margin: 10, fontWeight: 'bold'}}>
        Επιβεβαιωμένα
      </Text>
      {!places ? (
        <SkeletonPlaceList count={3} />
      ) : places.length == 0 ? (
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 16, margin: 10}}>Δέν έχεις κανένα μέρος</Text>
        </View>
      ) : (
        <FlatList
          data={places}
          renderItem={({item}) => (
            <ListItem
              p={item}
              navigation={navigation}
              getTranslatedType={getTranslatedType}
            />
          )}
          keyExtractor={item => item.id}
        />
      )}

      <Text style={{fontSize: 20, margin: 10, fontWeight: 'bold'}}>
        Σε αναμονή για επιβεβαιωμέωση
      </Text>
      {!applications ? (
        <SkeletonPlaceList count={3} />
      ) : applications.length == 0 ? (
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 16, margin: 10}}>Δέν έχεις καμία δήλωση</Text>
        </View>
      ) : (
        <FlatList
          data={applications}
          renderItem={({item}) => (
            <ApplicationItem application={item} navigation={navigation} />
          )}
          keyExtractor={item => item.id}
        />
      )}
    </ScrollView>
  );
}

function ApplicationItem({application}) {
  return (
    <View
      style={{
        margin: 10,
        marginLeft: 30,
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      {application.place_avatar ? (
        <Image
          source={{uri: Config.API_URL + application.place_avatar.url}}
          style={{height: 60, width: 60, borderRadius: 100}}
        />
      ) : (
        <View
          style={{
            height: 60,
            width: 60,
            borderRadius: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>{application.place_name.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <View>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginLeft: 20}}>
          {application.place_name}
        </Text>
        <Text style={{fontSize: 14, marginLeft: 20}}>
          Δήλωση πριν από {timeSince(new Date(application.created_at))}
        </Text>
      </View>
    </View>
  );
}

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

export default MyPlaces;
