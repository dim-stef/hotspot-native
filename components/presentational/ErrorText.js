/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text} from 'react-native';

function ErrorText({e}) {
  return (
    <View
      style={{
        backgroundColor: '#ed4337',
        padding: 20,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: 'white'}}>{e}</Text>
    </View>
  );
}

export default ErrorText;
