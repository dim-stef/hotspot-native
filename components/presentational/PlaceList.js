/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {SafeAreaView, ScrollView, StatusBar, FlatList} from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import PplButton from './PplButton';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import useTranslations from '../hooks/useTranslations';

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

const initFilters = {
  place_type: {
    param: 'place_type.type',
    value: null,
  },
  location: {
    param: 'location.short_name',
    value: null,
  },
};

function buildQuery(baseUri, params) {
  if (params) {
    var esc = encodeURIComponent;
    var query = Object.keys(params)
      .filter(k => params[k].value !== null)
      .map(k => esc(params[k].param) + '=' + esc(params[k].value))
      .join('&');
    let newUri = query ? `${baseUri}?${query}` : baseUri;
    return newUri;
  }
  return baseUri;
}

const ViewBoxesWithColorAndText = ({navigation, filters, setFilters}) => {
  const [places, setPlaces] = useState(null);
  const [translations, setTranslations] = useState([]);
  const [_, getTranslatedType, getTypeValueFromTranslation] = useTranslations();

  async function getPlaces() {
    try {
      let uri = buildQuery(Config.API_URL + '/places', filters);
      let response = await fetch(uri);
      let json = await response.json();
      setPlaces(json);
    } catch (e) {}
  }

  async function getTranslations() {
    try {
      let response = await fetch(Config.API_URL + '/translations');
      let json = await response.json();
      setTranslations(json[0].place_type);
    } catch (e) {}
  }

  function handlePress(place) {
    navigation.navigate('PlaceDetails', {p: place});
  }

  useEffect(() => {
    //getPlaces();
    getTranslations();
  }, []);

  useEffect(() => {
    getPlaces();
  }, [filters]);

  return places === null ? (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {[...Array(10)].map((a, i) => {
        return <Skeleton />;
      })}
    </ScrollView>
  ) : (
    <>
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
    </>
  );
};

export function ListItem({navigation, getTranslatedType, p}) {
  function handlePress() {
    navigation.navigate('PlaceDetails', {p: p});
  }

  return (
    <TouchableOpacity
      onPress={() => handlePress(p)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: 100,
        maxWidth: '100%',
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
      <View style={{height: '100%', flexBasis: '20%'}}>
        {p.profile_image ? (
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
        ) : (
          <View
            style={{
              height: 60,
              width: 60,
              borderRadius: 100,
              backgroundColor: '#f3f3f3',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>{p.name.charAt(0).toUpperCase()}</Text>
          </View>
        )}
      </View>
      <View style={{marginLeft: 10, flexBasis: '50%'}}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{fontSize: 16, fontWeight: 'bold'}}>
          {p.name}
        </Text>
        <Text style={{fontSize: 14}}>{getTranslatedType(p.place_type)}</Text>
        {p.last_assessment ? (
          <Text style={{fontSize: 12, color: 'gray'}}>
            Τελ. ενημερωση πριν{' '}
            {timeSince(new Date(p.last_assessment.created_at))}
          </Text>
        ) : null}
      </View>
      {p.last_assessment ? (
        <View style={{flexGrow: 1, marginLeft: 10, alignItems: 'center'}}>
          <Text style={{fontSize: 12, color: 'gray'}}>Κοσμος</Text>
          <PplButton population={p.last_assessment.assessment} />
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

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
  const [filters, setFilters] = useState(initFilters);

  function handleFilterPress() {
    navigation.navigate('Filters', {filters: filters, setFilters: setFilters});
  }

  function filtersActive() {
    return Object.keys(filters).some(k => filters[k].value !== null);
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{height: '100%'}}>
        <ViewBoxesWithColorAndText
          navigation={navigation}
          filters={filters}
          setFilters={setFilters}
        />
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
              backgroundColor: filtersActive() ? '#1bc4f2' : 'white',
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
            <AntDesignIcons
              name="filter"
              size={16}
              color={filtersActive() ? 'white' : 'black'}
            />
            <Text
              style={{
                marginLeft: 5,
                color: filtersActive() ? 'white' : 'black',
              }}>
              Φίλτρα
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  );
};

function Skeleton() {
  return (
    <View style={{padding: 10}}>
      <SkeletonPlaceholder>
        <View
          style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
          <View style={{width: 60, height: 60, borderRadius: 50}} />
          <View style={{marginLeft: 20, width: '100%', flex: 1}}>
            <View style={{flex: 1, height: 20, borderRadius: 4}} />
            <View
              style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
            />
          </View>
        </View>
      </SkeletonPlaceholder>
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

export default Wrapper;
