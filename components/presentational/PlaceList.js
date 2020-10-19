/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
import React, {useEffect, useState, useRef, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  TouchableNativeFeedback,
} from 'react-native';
import {SafeAreaView, ScrollView, StatusBar, FlatList} from 'react-native';
import {FAB} from 'react-native-paper';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PopulationIndicator from './PopulationIndicator';
import WaitTime from '../presentational/features/WaitTime/WaitTime';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import useTranslations from '../hooks/useTranslations';
import {UserContext} from '../Context';

const initFilters = {
  place_type: {
    param: 'place_type.type',
    value: null,
  },
  location: {
    param: 'location.short_name',
    value: null,
  },
  population: {
    param: 'population_contains',
    value: null,
  },
};

function areFiltersEmpty(filters) {
  Object.keys(filters).every(k => {
    return filters[k].value === null;
  });
}

function buildQuery(baseUri, params, extra = {}) {
  params = {...params, ...extra};
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

const PlaceList = ({navigation, filters, setFilters}) => {
  const limit = 5;
  const start = useRef(0);
  const [places, setPlaces] = useState(null);
  const [translations, setTranslations] = useState([]);
  //const [start, setStart] = useState(0);
  const [_, getTranslatedType, getTypeValueFromTranslation] = useTranslations(
    'place_types',
  );

  async function getPlaces() {
    try {
      let uri = buildQuery(Config.API_URL + '/places', filters, {
        start: {
          param: '_start',
          value: start.current,
        },
        limit: {
          param: '_limit',
          value: limit,
        },
      });
      let response = await fetch(uri);
      let json = await response.json();
      if (start.current != 0) {
        setPlaces([...places, ...json]);
      } else {
        setPlaces(json);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function getTranslations() {
    try {
      let response = await fetch(Config.API_URL + '/translations');
      let json = await response.json();
      setTranslations(json[0].place_type);
    } catch (e) {}
  }

  function loadData() {
    start.current = start.current + limit;
    getPlaces();
  }

  useEffect(() => {
    //getPlaces();
    getTranslations();
  }, []);

  useEffect(() => {
    start.current = 0;
    getPlaces();
  }, [filters]);

  return places == null ? (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {[...Array(10)].map((a, i) => {
        return <Skeleton />;
      })}
    </ScrollView>
  ) : (
    <View
      style={{
        height: '100%',
        width: '100%',
        justifyContent: 'center',
      }}>
      {places.length == 0 ? (
        <Text style={{marginTop: 40, fontSize: 18, alignSelf: 'center'}}>
          Δεν βρέθηκαν μέρη με αυτά τα φίλτρα
        </Text>
      ) : null}
      <FlatList
        onEndReached={loadData}
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
    </View>
  );
};

export function ListItem({navigation, getTranslatedType, p, instant = false}) {
  function handlePress() {
    if (instant) {
      // instantly go to place settings
      // this is used to save time for the place owner
      navigation.navigate('EditPlace', {place: p});
    } else {
      navigation.navigate('PlaceDetails', {p: p});
    }
  }

  return (
    <TouchableOpacity
      onPress={() => handlePress(p)}
      style={{
        alignItems: 'center',
        minHeight: 120,
        maxHeight: 200,
        padding: 20,
        maxWidth: '100%',
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
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
        }}>
        <View style={{flexBasis: '20%', justifyContent: 'center'}}>
          {p.profile_image ? (
            <Image
              source={{
                uri: Config.DOMAIN_URL + `${p.profile_image.url}`,
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
          {getTranslatedType(p.place_type) ? (
            <Text style={{fontSize: 14}}>
              {getTranslatedType(p.place_type)}
            </Text>
          ) : null}
        </View>
        {p.last_assessment ? (
          <View style={{flexGrow: 1, marginLeft: 10, alignItems: 'center'}}>
            <Text style={{fontSize: 12, color: 'gray', marginBottom: 5}}>
              Κόσμος
            </Text>
            <PopulationIndicator population={p.last_assessment.assessment} />
          </View>
        ) : null}
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '100%',
          justifyContent: 'flex-start',
          alignItems: 'center',
          margin: 5,
          marginTop: 10,
        }}>
        <View>
          {p.last_assessment ? (
            <Text style={{fontSize: 14}}>
              Ενημερώθηκε πριν{' '}
              {timeSince(new Date(p.last_assessment.created_at))}
            </Text>
          ) : null}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'flex-start',
              marginTop: 3,
            }}>
            <Icon name="map-outline" color="gray" style={{marginRight: 3}} />
            <Text style={{fontSize: 12, color: 'gray'}}>
              {p.location && p.location.full_name
                ? p.location.full_name.replace(/, Ελλάδα/g, '')
                : null}
            </Text>
          </View>
          <View style={{alignItems: 'flex-start'}}>
            {p.estimated_wait_time !== 0 && p.estimated_wait_time !== null ? (
              <WaitTime
                waitTime={p.estimated_wait_time}
                size="large"
                color="green"
                iconSize={12}
                style={{color: 'green', fontSize: 12}}
              />
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const Wrapper = ({navigation}) => {
  const [filters, setFilters] = useState(initFilters);
  const userContext = useContext(UserContext);

  function handleFilterPress() {
    navigation.navigate('Filters', {filters: filters, setFilters: setFilters});
  }

  function handleGoToPlacesPress() {
    navigation.navigate('MyPlaces', {instant: true});
  }

  function filtersActive() {
    return Object.keys(filters).some(k => filters[k].value !== null);
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={{height: '100%'}}>
        <PlaceList
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
          <View
            style={{
              borderRadius: 100,
              overflow: 'hidden',
              shadowColor: 'black',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            <TouchableNativeFeedback onPress={handleFilterPress}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 18,
                  backgroundColor: filtersActive() ? '#1bc4f2' : 'white',
                  borderRadius: 100,
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
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>
        {userContext.isAuth ? (
          <FAB
            style={styles.fab}
            icon="pencil-outline"
            color="white"
            onPress={handleGoToPlacesPress}
          />
        ) : null}
      </View>
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

const styles = StyleSheet.create({
  fab: {
    backgroundColor: '#1bc4f2',
    position: 'absolute',
    margin: 30,
    right: 0,
    bottom: 0,
  },
});

export default Wrapper;
