/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
import React, {useEffect, useContext, useState, useLayoutEffect} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import {Picker} from '@react-native-community/picker';
import {PlaceTypesContext} from '../Context';
import useTranslations from '../hooks/useTranslations';

function useFilters(
  defaultValue,
  paramValue,
  getValuesEndpoint,
  buildValues,
  translations,
) {
  const placeTypesContext = useContext(PlaceTypesContext);
  function getTranslation(value) {
    try {
      return translations.types.find(item => item.type == value).translations
        .el;
    } catch (e) {
      return null;
    }
  }
  const [values, setValues] = useState(placeTypesContext.types);
  let defaultSelected = paramValue ? getTranslation(paramValue) : defaultValue;
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  async function getValues() {
    try {
      let response = await fetch(getValuesEndpoint);
      let json = await response.json();
      setValues(buildValues(json));
      placeTypesContext.types = buildValues(json);
    } catch (e) {
      return;
    }
  }

  useLayoutEffect(() => {
    setSelectedValue(getTranslation(paramValue));
  }, [values, translations]);

  useLayoutEffect(() => {
    if (placeTypesContext.types.length === 1) {
      getValues();
    }
  }, [translations]);

  return [values, setValues, selectedValue, setSelectedValue];
}
function Filters({navigation, ...rest}) {
  const defaultLocationValue = 'Όλες οι περιοχές';
  const defaultPlaceTypeValue = 'Όλα τα είδη';
  const [locations, setLocations] = useState([{value: defaultLocationValue}]);
  const [
    translations,
    getTranslatedType,
    getTypeValueFromTranslation,
  ] = useTranslations();

  function buildPlaceTypeValues(jsonLocations) {
    return [
      {value: defaultPlaceTypeValue},
      ...jsonLocations.map(place_type => {
        return {value: getTranslatedType(place_type)};
      }),
    ];
  }

  const [
    placeTypes,
    setPlaceTypes,
    selectedPlaceType,
    setSelectedPlaceType,
  ] = useFilters(
    defaultPlaceTypeValue,
    rest.route.params.filters.place_type.value,
    Config.API_URL + '/place-types',
    buildPlaceTypeValues,
    translations,
  );

  let defaultLocationSelected = rest.route.params.filters.location.value
    ? {
        value: rest.route.params.filters.location.value,
      }
    : locations[0];

  const [selectedLocation, setSelectedLocation] = useState(
    defaultLocationSelected.value,
  );

  function buildValues(jsonLocations) {
    return [
      {value: defaultLocationValue},
      ...jsonLocations.map(location => {
        return {value: location.name};
      }),
    ];
  }

  async function getLocations() {
    try {
      let response = await fetch(Config.API_URL + '/generic-locations');
      let json = await response.json();
      setLocations(buildValues(json));
    } catch (e) {
      return;
    }
  }

  useEffect(() => {
    getLocations();
  }, []);

  /*useEffect(() => {
    if (selectedLocation !== prevSelectedLocation) {
      rest.route.params.setFilters(filters => ({
        ...filters,
        location: {
          value: selectedLocation === defaultLocationValue ? null : selectedLocation,
        },
      }));
    }
    setPrevSelectedLocation(selectedLocation);
  }, [selectedLocation]);*/

  function handleFilterPress() {
    rest.route.params.setFilters(filters => ({
      ...filters,
      location: {
        param: 'location.short_name',
        value:
          selectedLocation === defaultLocationValue ? null : selectedLocation,
      },
      place_type: {
        param: 'place_type.type',
        value:
          selectedPlaceType === defaultPlaceTypeValue
            ? null
            : getTypeValueFromTranslation(selectedPlaceType),
      },
    }));

    navigation.navigate('Home');
  }

  return (
    <View style={{width: '100%', justifyContent: 'center', padding: 10}}>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 20,
          marginBottom: 20,
        }}>
        Φίλτραρε ανά περιοχή
      </Text>
      <CustomPicker
        options={locations}
        setOption={setSelectedLocation}
        selectedOption={selectedLocation}
      />
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 20,
          marginBottom: 20,
        }}>
        Φίλτραρε ανά είδος
      </Text>
      <CustomPicker
        options={placeTypes}
        setOption={setSelectedPlaceType}
        selectedOption={selectedPlaceType}
      />
      <View
        style={{
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={handleFilterPress}
          style={{
            backgroundColor: '#1bc4f2',
            padding: 20,
            borderRadius: 50,
            marginTop: 50,
          }}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Εφαρμογή</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function CustomPicker({options, setOption, selectedOption}) {
  return (
    <View
      style={{
        backgroundColor: '#ececec',
        borderRadius: 2,
        marginTop: 10,
        width: '70%',
      }}>
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
