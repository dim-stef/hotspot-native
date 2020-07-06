/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
import React, {useState, useContext, useEffect} from 'react';
import ActionButton from 'react-native-action-button';
import {Dimensions, View, Text, Image, TouchableOpacity} from 'react-native';
import PplButton from './PplButton';
import {SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import AntDesignIcons from 'react-native-vector-icons/Feather';
import {UserContext} from '../Context';
import {getColorFromURL} from 'rn-dominant-color';

function PlaceDetails({navigation, route}) {
  const [p, setP] = useState(route.params.p);
  const [dominantColor, setDominantColor] = useState('#f00000');
  const userContext = useContext(UserContext);

  const width = Dimensions.get('window').width;

  const [translations, setTranslations] = useState([]);
  const [assessments, setAssessments] = useState([]);

  function ownsPlace(p) {
    return userContext.user && p.user.id === userContext.user.id;
  }
  function getTranslatedType(p) {
    try {
      return translations.types.find(item => {
        return item.type === p.place_type.type;
      }).translations.el;
    } catch (e) {
      return 'Αλλο';
    }
  }
  async function getTranslations() {
    try {
      let response = await fetch(Config.API_URL + '/translations');
      let json = await response.json();
      setTranslations(json[0].place_type);
    } catch (e) {}
  }
  async function getPopulationAssessments() {
    try {
      let response = await fetch(
        Config.API_URL +
          `/population-assessments?place.id=${p.id}&_sort=created_at:DESC`,
      );
      let json = await response.json();
      setAssessments(json);
    } catch (e) {}
  }
  useEffect(() => {
    if (p) {
      getPopulationAssessments();
      try {
        getColorFromURL(Config.API_URL + p.profile_image.url).then(colors => {
          setDominantColor(colors.primary);
        });
      } catch (e) {
        setDominantColor('#dddddd');
      }
    }

    getTranslations();
  }, [p]);

  if (p) {
    const url = Config.API_URL;

    const images = {
      thumbnail: p.profile_image
        ? url + p.profile_image.formats.thumbnail.url
        : null,
      profile: p.profile_image ? url + p.profile_image.url : null,
    };
    return (
      <>
        <ScrollView style={{height: '100%'}}>
          <View>
            <View
              source={{uri: images.thumbnail}}
              style={{
                width: width,
                height: 130,
                opacity: 0.7,
                backgroundColor: dominantColor,
              }}
            />
            <View style={styles.placeCard}>
              <View style={styles.placeInfoCard}>
                {images.profile ? (
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
                ) : (
                  <View
                    style={{
                      width: 70,
                      height: 70,
                      marginTop: 15,
                      marginLeft: 10,
                      borderRadius: 150,
                      backgroundColor: '#f3f3f3',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text style={{fontSize: 26, fontWeight: 'bold'}}>
                      {p.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}

                <View style={styles.info}>
                  <Text style={styles.name}>{p.name}</Text>
                  <Text style={styles.type}>{getTranslatedType(p)}</Text>
                </View>
              </View>
              {p.last_assessment ? (
                <View style={styles.ppl}>
                  <Text>Πληθυσμός</Text>
                  <PplButton population={p.last_assessment.assessment} />
                </View>
              ) : null}
            </View>
            <View style={styles.desc}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginTop: 10,
                }}>
                Λεπτομέρειες:
              </Text>
              <Text
                style={{
                  fontWeight: '100',
                  fontSize: 15,
                  marginTop: 5,
                }}>
                Phasellus faucibus scelerisque eleifend donec pretium. Orci
                porta non pulvinar neque laoreet suspendisse. Amet nisl suscipit
                adipiscing bibendum est.
              </Text>
            </View>
            <View style={styles.footer}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginTop: 10,
                }}>
                Ιστορικό
              </Text>
              <View style={styles.footerButtons}>
                {/*<TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerButtonText}>Ιστορικό</Text>
              </TouchableOpacity> */}

                {/*<TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerButtonText}>Button 2</Text>
              </TouchableOpacity> */}
              </View>
              <View style={styles.list}>
                {assessments.length > 0 &&
                  assessments.map(item => (
                    <View style={styles.ListItem} key={item.created_at}>
                      <PplButton population={item.assessment} />
                      <View
                        style={{
                          marginLeft: 25,
                          height: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '40%',
                        }}>
                        <Text style={{fontSize: 16}}>
                          Πρίν από {timeSince(new Date(item.created_at))}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>
            </View>
          </View>
        </ScrollView>
        {ownsPlace(p) ? (
          <ActionButton
            buttonColor="#03a9f4"
            onPress={() => navigation.navigate('EditPlace', {place: p})}
            renderIcon={active =>
              active ? (
                <AntDesignIcons name="edit-2" size={26} color="white" />
              ) : (
                <AntDesignIcons name="edit-2" size={26} color="white" />
              )
            }
          />
        ) : null}
      </>
    );
  } else {
    return (
      <View>
        <Text>Waiting</Text>
      </View>
    );
  }
}

function timeSince(date) {
  let seconds = Math.floor((new Date() - date) / 1000);

  let interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + ' χρόνια';
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + ' μήνες';
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + ' μέρες';
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + ' ώρες';
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + ' λεπτά';
  }
  return Math.floor(seconds) + ' δευτ.';
}

const styles = StyleSheet.create({
  list: {
    marginTop: 10,
  },
  ListItem: {
    display: 'flex',
    flexDirection: 'row',
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
    flexDirection: 'column',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    flexWrap: 'wrap',
    width: 150,
  },
  placeInfoCard: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});

export default PlaceDetails;
