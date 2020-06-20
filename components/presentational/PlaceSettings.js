import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-community/async-storage';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

function PlaceSettings() {
  const [place, setPlace] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
  return (
    <>
      <GooglePlacesAutocomplete
        placeholder="Search"
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
    </>
  );
}

export default PlaceSettings;
