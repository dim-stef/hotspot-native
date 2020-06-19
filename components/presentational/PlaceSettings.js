import React, {useState, useEffect} from 'react';
import Config from 'react-native-config';
import {Text} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import GetLocation from 'react-native-get-location';
import MapView from 'react-native-maps';

function PlaceSettings() {
  const [geolocation, setGeolocation] = useState();
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
