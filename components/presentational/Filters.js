/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import {Picker} from '@react-native-community/picker';

function Filters({navigation, ...rest}) {
  const [locations, setLocations] = useState([{value: 'Διάλεξε περιοχή'}]);
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  function buildValues(jsonLocations) {
    return [
      {value: 'Διάλεξε περιοχή'},
      ...jsonLocations.map(location => {
        return {value: location.short_name};
      }),
    ];
  }

  async function getLocations() {
    try {
      let response = await fetch(Config.API_URL + '/locations');
      let json = await response.json();
      setLocations(buildValues(json));
    } catch (e) {
      return;
    }
  }

  useEffect(() => {
    getLocations();
  }, []);

  return (
    <CustomPicker
      options={locations}
      setOption={setSelectedLocation}
      selectedOption={selectedLocation}
    />
  );
}

function CustomPicker({options, setOption, selectedOption}) {
  return (
    <View style={{backgroundColor: '#ececec', borderRadius: 2, marginTop: 10}}>
      <Picker
        selectedValue={selectedOption}
        style={{height: 50, width: '100%'}}
        onValueChange={(itemValue, itemIndex) => {
          setOption(itemValue);
        }}>
        {options.map((item, i) => {
          return <Picker.item key={i} label={item.value} value={item.value} />;
        })}
      </Picker>
    </View>
  );
}

export default Filters;
