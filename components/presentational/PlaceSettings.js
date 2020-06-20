/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import Config from 'react-native-config';
import {Text} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import GetLocation from 'react-native-get-location';
import AsyncStorage from '@react-native-community/async-storage';
import MapView from 'react-native-maps';

function PlaceSettings() {
  const [geolocation, setGeolocation] = useState();
  const [place, setPlace] = useState(null);

  async function getPlaceDetails() {
    try {
      let response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?language=el&placeid=${
          place.place_id
        }&key=${Config.GOOGLE_API_KEY}`,
      );
      let json = await response.json();
      console.log(json);
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
    console.log('data', data, addressLocality);
    let token = null;
    try {
      token = await AsyncStorage.getItem('token');
    } catch (e) {
      // saving error
    }
    if (token && addressLocality) {
      try {
        let response = await fetch(`${Config.API_URL}/locations/`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            place_id: data.place_id,
            long_name: addressLocality.long_name,
            short_name: addressLocality.short_name,
            latitude: data.geometry.location.lat,
            longitude: data.geometry.location.lng,
          }),
        });
        let json = await response.json();
        console.log(json);
      } catch (e) {
        console.log(e);
      }
    } else {
      console.log('iner', token);
    }
  }

  useEffect(() => {
    if (place) {
      getPlaceDetails();
    }
  }, [getPlaceDetails, place]);

  useEffect(() => {
    getLocation();
  }, []);
  if (geolocation) {
    return (
      <>
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
        <MapView
          style={{width: 400, height: 400}}
          showsUserLocation={true}
          showCompass={true}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </>
    );
  } else {
    return <Text>Waiting bruh...</Text>;
  }
  async function getLocation() {
    try {
      let temp = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });
      console.log(temp);
      setGeolocation(temp);
    } catch (err) {
      console.error(err.message);
    }
  }
}

export default PlaceSettings;
