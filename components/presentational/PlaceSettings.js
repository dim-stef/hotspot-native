/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useState,
  useEffect,
  useContext,
  PermissionsAndroid,
} from 'react';
import Config from 'react-native-config';
import {Text, View} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-community/async-storage';
import MapView from 'react-native-maps';
import {PlaceContext} from '../Context';

function PlaceSettings({navigation, ...rest}) {
  const [mapref, setMapref] = useState();
  const [geolocation, setGeolocation] = useState({
    latitude: 37.97945,
    longitude: 23.71622,
  });
  const [place, setPlace] = useState(null);
  const [geometry, setGeometry] = useState({lat: 37.97945, lng: 23.71622});
  const placeContext = useContext(PlaceContext);

  async function getPlaceDetails() {
    try {
      let response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?language=el&placeid=${
          place.place_id
        }&key=${Config.GOOGLE_API_KEY}`,
      );
      let json = await response.json();
      createLocation(json.result);
      //return json.movies;
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
  useEffect(() => {
    if (place) {
      getPlaceDetails();
    }
  }, [place]);

  const animateToRegion = () => {
    mapref.animateToRegion(
      {
        latitude: geolocation.latitude,
        longitude: geolocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      3,
    );
  };

  if (geolocation) {
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
                console.log(data);
                setPlace(data);
              }}
              onChangeText={data => {
                console.log(data);
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
