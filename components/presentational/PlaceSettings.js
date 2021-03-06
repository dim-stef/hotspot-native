/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useContext} from 'react';
import {PermissionsAndroid} from 'react-native';
import Config from 'react-native-config';
import {Text, View, Navigator} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-community/async-storage';
import MapView from 'react-native-maps';
import {PlaceContext} from '../Context';
import Geolocation from '@react-native-community/geolocation';

function PlaceSettings({navigation, ...rest}) {
  const [mapref, setMapref] = useState();
  const [place, setPlace] = useState(null);
  const [geometry, setGeometry] = useState({lat: 37.97945, lng: 23.71622});
  const placeContext = useContext(PlaceContext);

  async function getCurrentPlaceFromPosition() {
    try {
      let response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json??language=el&latlng=${
          geometry.lat
        },${geometry.lng}&key=${Config.GOOGLE_API_KEY}`,
      );
      let json = await response.json();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getCurrentPlaceFromPosition();
  }, [geometry]);
  async function getPlaceDetails() {
    try {
      let response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?language=el&placeid=${
          place.place_id
        }&key=${Config.GOOGLE_API_KEY}`,
      );
      let json = await response.json();
      createLocation(json.result);
    } catch (error) {
      console.error(error);
    }
  }

  async function createLocation(data) {
    let addressLocality = data.address_components.find(component =>
      component.types.includes('locality'),
    );
    let token = null;
    try {
      token = await AsyncStorage.getItem('token');
    } catch (e) {
      // saving error
    }
    if (token && addressLocality) {
      setGeometry({
        lng: data.geometry.location.lng,
        lat: data.geometry.location.lat,
      });
      let body = {
        place_id: data.place_id,
        long_name: addressLocality.long_name,
        short_name: addressLocality.short_name,
        latitude: data.geometry.location.lat,
        longitude: data.geometry.location.lng,
        full_name: data.formatted_address,
      };
      placeContext.place = body;

      try {
        rest.route.params.setPlaceDescription(place.description);
        rest.route.params.setPlace(body);
      } catch (e) {}
      placeContext.place.description = place.description;
      /*try {
        let response = await fetch(`${Config.API_URL}/locations/`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        let json = await response.json();
      } catch (e) {
        console.log(e);
      }*/
    } else {
    }
  }

  async function requestLocationPermission() {
    //navigator.geolocation.requestAuthorization();
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'This App needs access to your location ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(info => {
          setGeometry(
            {lat: info.coords.latitude, lng: info.coords.longitude},
            error => console.log('Error', JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
          );
        });
      } else {
        setGeometry({lat: 37.97945, lng: 23.71622});
      }
    } catch (err) {
      console.error(err);
      setGeometry({lat: 37.97945, lng: 23.71622});
    }
  }

  useEffect(() => {
    //requestLocationPermission();
    if (place) {
      getPlaceDetails();
    }
  }, [place]);

  if (geometry) {
    const animateToRegion = () => {
      mapref.animateToRegion(
        {
          latitude: geometry.lat,
          longitude: geometry.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        5,
      );
    };

    return (
      <>
        <View style={{flexDirection: 'column'}}>
          <View
            style={{
              position: 'absolute',
              width: '100%',
              zIndex: 1,
              backgroundColor: 'white',
            }}>
            <GooglePlacesAutocomplete
              placeholder="Search"
              fetchDetails={true}
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                setPlace(data);
              }}
              onFail={error => console.log(error)}
              query={{
                key: Config.GOOGLE_API_KEY,
                language: 'el',
                components: 'country:gr',
              }}
            />
          </View>
          <MapView
            ref={ref => {
              setMapref(ref);
            }}
            onMapReady={animateToRegion}
            style={{width: '100%', height: '100%'}}
            showsUserLocation={true}
            showCompass={true}
            region={{
              latitude: geometry.lat,
              longitude: geometry.lng,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      </>
    );
  } else {
    return (
      <View
        style={{
          height: '100%',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontWeight: 'bold', fontSize: 16}}>Loading map</Text>
      </View>
    );
  }
}

export default PlaceSettings;
