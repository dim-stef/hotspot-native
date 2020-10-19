/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

function WaitTime({
  size = 'small',
  waitTime,
  style = {},
  iconSize = 16,
  color = '#9e9e9e',
}) {
  let _waitTime = `<${waitTime}`;

  if (_waitTime > 30) {
    _waitTime = '>30';
  }
  return (
    <View
      style={{
        marginTop: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Icon name="timer" size={iconSize} color={color} />
      {size == 'small' ? (
        <Text
          style={{
            marginLeft: 3,
            color: color,
            ...style,
          }}>{`${_waitTime} λεπτά`}</Text>
      ) : (
        <Text style={{marginLeft: 3, color: color,...style}}>
          {`Χρόνος αναμονής ${_waitTime} λεπτά`}
        </Text>
      )}
    </View>
  );
}

export default WaitTime;
