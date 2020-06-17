import React from 'react';
import Config from 'react-native-config';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

function PlaceSettings() {
  return (
    <>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data);
        }}
        onChangeText={data => {
          console.log(data);
        }}
        onFail={error => console.log(error)}
        query={{
          key: Config.GOOGLE_API_KEY,
          language: 'en',
        }}
      />
    </>
  );
}

export default PlaceSettings;
