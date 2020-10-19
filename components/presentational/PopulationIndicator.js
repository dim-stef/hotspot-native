/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Dimensions,
  View,
  Text,
  Animated,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
const colors = {
  backgroundLow: '#4caf5096',
  backgroundMedium: '#03a9f45e',
  backgroundHigh: '#f403035e',
  textLow: 'green',
  textMedium: '#03a9f4',
  textHigh: '#f44336',
};

const PopulationIndicator = ({population, editCalendarMode = false}) => {
  if (population) {
    population = population.toLowerCase();
  }

  // if indicator is in calendar mode and population is not set
  // show gray background in order to "set" it
  // else show regular background color based on the existing population
  const backgroundColor =
    editCalendarMode && !population
      ? '#eaeaea'
      : population === 'low'
      ? colors.backgroundLow
      : population === 'medium'
      ? colors.backgroundMedium
      : colors.backgroundHigh;

  // do the same for text color
  const textColor =
    editCalendarMode && !population
      ? 'gray'
      : population === 'low'
      ? colors.textLow
      : population === 'medium'
      ? colors.textMedium
      : colors.textHigh;
  const text =
    editCalendarMode && !population
      ? 'Κόσμος'
      : population === 'low'
      ? 'Λίγος'
      : population === 'medium'
      ? 'Μεσαίος'
      : 'Πολύς';
  return (
    <>
      <View
        style={{
          backgroundColor: backgroundColor,
          flexGrow: 1,
          minHeight: 50,
          borderRadius: 5,
          width: 80,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            color: textColor,
          }}>
          {text}
        </Text>
      </View>
    </>
  );
};

export default PopulationIndicator;
