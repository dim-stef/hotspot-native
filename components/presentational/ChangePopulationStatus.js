/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';

const colors = {
  backgroundLow: '#4caf5096',
  backgroundMedium: '#03a9f45e',
  backgroundHigh: '#f403035e',
  textLow: 'green',
  textMedium: '#03a9f4',
  textHigh: '#f44336',
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

function ChangePopulationStatus({status, setStatus, onChange = () => {}}) {
  function handleChange(value) {
    // using this to display results after "click" instead of after "mount"
    onChange(value);

    // using this for rendering purposes
    setStatus(value);
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        padding: 0,
      }}>
      <StatusButton
        status={status}
        value="Low"
        label="Λίγος"
        backgroundColor={colors.backgroundLow}
        color={colors.textLow}
        onPress={() => handleChange('Low')}
        style={{
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          borderRightColor: '#ececec',
          borderRightWidth: 1,
        }}
      />
      <StatusButton
        status={status}
        value="Medium"
        label="Μεσαίος"
        backgroundColor={colors.backgroundMedium}
        color={colors.textMedium}
        onPress={() => handleChange('Medium')}
        style={{borderRightColor: '#ececec', borderRightWidth: 1}}
      />
      <StatusButton
        status={status}
        value="High"
        label="Πολύς"
        backgroundColor={colors.backgroundHigh}
        color={colors.textHigh}
        onPress={() => handleChange('High')}
        style={{borderTopRightRadius: 10, borderBottomRightRadius: 10}}
      />
    </View>
  );
}

function StatusButton({
  status,
  value,
  label,
  backgroundColor,
  color,
  onPress,
  style = {},
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 100,
        flexGrow: 1,
        backgroundColor: status === value ? backgroundColor : '#f7f7f7',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}>
      <Text
        style={{
          fontSize: 20,
          color: status === value ? color : 'black',
          fontWeight: 'bold',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default ChangePopulationStatus;
