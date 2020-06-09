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
} from 'react-native'
const colors = {
    backgroundLow: '#4caf5096',
    backgroundMedium: '#03a9f45e',
    backgroundHigh: '#f403035e',
    textLow: 'green',
    textMedium: '#03a9f4',
    textHigh: '#f44336',
  };

const PplButton = (props)=>{
  const population = props.population.toLowerCase();

    return(
      <>
        <View
        style={{
          backgroundColor:
            population === 'low'
              ? colors.backgroundLow
              : population === 'medium'
              ? colors.backgroundMedium
              : colors.backgroundHigh,
          flexGrow: 1,
          borderRadius: 5,
          width: 60,
          justifyContent: 'center',
          alignItems: 'center'
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              color:
               population === 'low'
                  ? colors.textLow
                  : population === 'medium'
                  ? colors.textMedium
                  : colors.textHigh,
            }}>{population === 'low'
              ? 'Λίγος'
              : population === 'medium'
              ? 'Μεσαίος'
              : 'Πολύς'}
          </Text>
        </View>
      </>
      )

}

export default PplButton
