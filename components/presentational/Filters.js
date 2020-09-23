/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
import React, {
  useEffect,
  useContext,
  useState,
  useLayoutEffect,
  useMemo,
} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import {Picker} from '@react-native-community/picker';
import {
  PlaceTypesContext,
  LocationsContext,
  PopulationContext,
} from '../Context';
import useTranslations from '../hooks/useTranslations';

const populationValues = [
  {
    value: 'low',
  },
  {
    value: 'medium',
  },
  {
    value: 'high',
  },
];
function useFilters({
  defaultValue = null,
  paramValue = null,
  fixedValues = false,
  getValuesEndpoint = null,
  buildValues = null,
  translations = null,
  hasTranslations = false,
  translationsLoading = false,
  _context = null,
}) {
  const placeTypesContext = useContext(_context);
  function getTranslation(value) {
    try {
      return translations.types.find(item => item.type == value).translations
        .el;
    } catch (e) {
      return null;
    }
  }
  const [values, setValues] = useState(placeTypesContext.types);
  let defaultSelected = paramValue
    ? hasTranslations
      ? getTranslation(paramValue)
      : paramValue
    : defaultValue;
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  async function getValues() {
    if (fixedValues) {
      setValues(buildValues());
    } else {
      try {
        let response = await fetch(getValuesEndpoint);
        let json = await response.json();
        setValues(buildValues(json));
        placeTypesContext.types = buildValues(json);
      } catch (e) {
        return;
      }
    }
  }

  useLayoutEffect(() => {
    if (!translationsLoading) {
      setSelectedValue(
        hasTranslations ? getTranslation(paramValue) : paramValue,
      );
    }
  }, [values, translationsLoading]);

  useLayoutEffect(() => {
    if (!translationsLoading && placeTypesContext.types.length === 1) {
      getValues();
    }
  }, [translationsLoading]);

  return [values, setValues, selectedValue, setSelectedValue];
}
const Filters = React.memo(({navigation, ...rest}) => {
  const defaultLocationValue = 'Όλες οι περιοχές';
  const defaultPlaceTypeValue = 'Όλα τα είδη';
  const defaultPopulationValue = 'Όλοι οι πληθυσμοί';
  //const [locations, setLocations] = useState([{value: defaultLocationValue}]);
  const [
    translations,
    getTranslatedType,
    getTypeValueFromTranslation,
    translationsLoading,
  ] = useTranslations();

  const [
    populationTranslations,
    getPopulationTranslatedType,
    getTypeValueFromPopulationTranslation,
    populationTranslationsLoading,
  ] = useTranslations(1);

  function buildPlaceTypeValues(jsonLocations) {
    return [
      {value: defaultPlaceTypeValue},
      ...jsonLocations.map(place_type => {
        return {value: getTranslatedType(place_type)};
      }),
    ];
  }

  function buildValues(jsonLocations) {
    return [
      {value: defaultLocationValue},
      ...jsonLocations.map(location => {
        return {value: location.name};
      }),
    ];
  }

  function buildPopulationValues() {
    return [
      {value: defaultPopulationValue},
      ...populationValues.map(population => {
        return {value: getPopulationTranslatedType(population.value)};
      }),
    ];
  }

  const [
    placeTypes,
    setPlaceTypes,
    selectedPlaceType,
    setSelectedPlaceType,
  ] = useFilters({
    defaultValue: defaultPlaceTypeValue,
    paramValue: rest.route.params.filters.place_type.value,
    fixedValues: null,
    getValuesEndpoint: Config.API_URL + '/place-types',
    buildValues: buildPlaceTypeValues,
    translations: translations,
    hasTranslations: true,
    translationsLoading: translationsLoading,
    _context: PlaceTypesContext,
  });

  const [
    locations,
    setLocations,
    selectedLocation,
    setSelectedLocation,
  ] = useFilters({
    defaultValue: defaultLocationValue,
    paramValue: rest.route.params.filters.location.value,
    fixedValues: null,
    getValuesEndpoint: Config.API_URL + '/generic-locations',
    buildValues: buildValues,
    translations: null,
    hasTranslations: false,
    translationsLoading: false,
    _context: LocationsContext,
  });

  const [
    populations,
    setPopulations,
    selectedPopulation,
    setSelectedPopulation,
  ] = useFilters({
    defaultValue: defaultPopulationValue,
    paramValue: rest.route.params.filters.population.value,
    fixedValues: true,
    getValuesEndpoint: Config.API_URL + '/place-types',
    buildValues: buildPopulationValues,
    translations: populationTranslations,
    hasTranslations: true,
    translationsLoading: populationTranslationsLoading,
    _context: PopulationContext,
  });

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
      population: {
        param: 'population_contains',
        value:
          selectedPopulation === defaultPopulationValue
            ? null
            : getTypeValueFromPopulationTranslation(selectedPopulation),
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
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginTop: 20,
          marginBottom: 20,
        }}>
        Φίλτραρε ανά πληθυσμό
      </Text>
      <CustomPicker
        options={populations}
        setOption={setSelectedPopulation}
        selectedOption={selectedPopulation}
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
});

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
