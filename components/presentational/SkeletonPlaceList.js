import Config from 'react-native-config';
import React, {useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

export function Skeleton() {
  return (
    <View style={{padding: 10}}>
      <SkeletonPlaceholder>
        <View
          style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
          <View style={{width: 60, height: 60, borderRadius: 50}} />
          <View style={{marginLeft: 20, width: '100%', flex: 1}}>
            <View style={{flex: 1, height: 20, borderRadius: 4}} />
            <View
              style={{marginTop: 6, width: 80, height: 20, borderRadius: 4}}
            />
          </View>
        </View>
      </SkeletonPlaceholder>
    </View>
  );
}

export default function SkeletonPlaceList({count = 10}) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      {[...Array(count)].map((a, i) => {
        return <Skeleton />;
      })}
    </ScrollView>
  );
}
