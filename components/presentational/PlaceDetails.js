/* eslint-disable react-native/no-inline-styles */
import React, {useState, useContext} from 'react';
import {Dimensions, View, Text, Image, TouchableOpacity} from 'react-native';
import PplButton from './PplButton';
import {SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import {UserContext} from '../Context';

function PlaceDetails({navigation, route}) {
  const [p, setP] = useState(route.params.p);
  const userContext = useContext(UserContext);

  const width = Dimensions.get('window').width;

  if (p) {
    const url = 'http://192.168.1.6:1337';
    const assesments = p.population_assessments.reverse();
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
              marginTop: 30,
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
              <PplButton population={p.last_assessment.assessment} />
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
              adipiscing bibendum est.
            </Text>
          </View>
          <View style={styles.footer}>
            <View style={styles.footerButtons}>
              <TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerButtonText}>History</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerButtonText}>Button 2</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.list}>
              {assesments.map(item => (
                <View style={styles.ListItem} key={item.created_at}>
                  {console.log(item)}
                  <PplButton population={item.assessment} />
                  <View
                    style={{
                      marginLeft: 75,
                    }}>
                    <Text>
                      Created at:{' '}
                      {item.created_at.substring(
                        item.created_at.lastIndexOf('T') + 1,
                        item.created_at.lastIndexOf('.'),
                      )}
                    </Text>
                    <Text>Date: {item.created_at.split('T')[0]}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
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
  list: {
    marginTop: 10,
  },
  ListItem: {
    display: 'flex',
    flexDirection: 'row',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    justifyContent: 'center',
  },
  footer: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  footerButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  footerButton: {
    width: '45%',
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomColor: '#0892d0',
    borderWidth: 2,
  },
  footerButtonText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'black',
  },
  desc: {
    marginTop: 3,
    marginLeft: 10,
    marginRight: 10,
  },
  placeCard: {
    marginTop: 10,
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
