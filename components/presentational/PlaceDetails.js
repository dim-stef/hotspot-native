/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useContext} from 'react';
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
import PplButton from './PplButton';
import {SafeAreaView, StyleSheet, ScrollView, StatusBar} from 'react-native';
import {Picker} from '@react-native-community/picker';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import {UserContext} from '../Context';

function PlaceDetails({navigation, route}) {
  const [p, setP] = useState(route.params.p);
  const userContext = useContext(UserContext);

  console.log(userContext);
  const width = Dimensions.get('window').width;

  if (p) {
    const url = 'http://192.168.2.5:1337';

    const images = {
      thumbnail: url + p.profile_image.formats.thumbnail.url,
      profile: url + p.profile_image.url,
    };
    return (
      <SafeAreaView>
        <View>
          <Image
            source={{uri: images.thumbnail}}
            style={{
              width: width - 20,
              marginLeft: 10,
              marginTop: 15,
              borderRadius: 10,
              height: 130,
            }}
          />
          <View style={styles.placeCard}>
            <View style={styles.placeInfoCard}>
              <Image
                source={{uri: images.profile}}
                style={{
                  width: 70,
                  height: 70,
                  marginTop: 15,
                  marginLeft: 10,
                  borderRadius: 100,
                }}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{p.name}</Text>
                <Text style={styles.type}>{p.type}</Text>
              </View>
            </View>

            <View style={styles.ppl}>
              <Text>Popolo</Text>
              <PplButton population={p.population} />
            </View>
          </View>
          <View style={styles.desc}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 18,
                marginTop: 10,
              }}>
              Description:
            </Text>
            <Text
              style={{
                fontWeight: '100',
                fontSize: 15,
                marginTop: 5,
              }}>
              Phasellus faucibus scelerisque eleifend donec pretium. Orci porta
              non pulvinar neque laoreet suspendisse. Amet nisl suscipit
              adipiscing bibendum est ultricies integer quis auctor. Ut
              tristique et egestas quis ipsum suspendisse ultrices gravida
              dictum.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  } else {
    return (
      <View>
        <Text>Waiting</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  desc: {
    marginLeft: 10,
    marginRight: 10,
  },
  placeCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 20,
  },
  ppl: {
    marginTop: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  info: {
    marginLeft: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  placeInfoCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export default PlaceDetails;
