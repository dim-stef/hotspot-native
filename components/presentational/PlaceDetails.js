/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
import React, {useState, useContext, useEffect} from 'react';
import ActionButton from 'react-native-action-button';
import {
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableNativeFeedback,
  Button,
  RefreshControl,
} from 'react-native';
import PopulationIndicator from './PopulationIndicator';
import WaitTime from '../presentational/features/WaitTime/WaitTime';
import {SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import {FAB} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesignIcons from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import Calendar from '../presentational/features/Calendar/Calendar';
import {UserContext} from '../Context';
import {getColorFromURL} from 'rn-dominant-color';

function PlaceDetails({navigation, route}) {
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const [place, setPlace] = useState(route.params.p);
  const [refreshing, setRefreshing] = useState(false);
  const [dominantColor, setDominantColor] = useState('#f00000');
  const userContext = useContext(UserContext);

  const width = Dimensions.get('window').width;
  const [translations, setTranslations] = useState([]);
  const [assessments, setAssessments] = useState([]);
  let reportMessage = 'Ανεφερε το';
  let canReport = true;
  if (place.reported) {
    reportMessage = 'Εχεις ηδη αναφερει αυτο το μερος';
    canReport = false;
  } else if (!userContext.isAuth) {
    reportMessage = 'Πρεπει να εχεις λογαριασμο για να αναφερεις ενα μερος';
    canReport = false;
  }

  function ownsPlace(place) {
    return userContext.user && place.user.id === userContext.user.id;
  }
  const toggleModal = () => {
    setReportModalVisible(!isReportModalVisible);
  };

  async function refreshPlace() {
    try {
      setRefreshing(true);
      const url = `${Config.API_URL}/places?id=${place.id}`;
      let response = await fetch(url);
      let json = await response.json();
      setRefreshing(false);
      setPlace(json[0]);
    } catch (e) {
      console.error(e);
      setRefreshing(false);
    }
  }
  function getTranslatedType(place) {
    try {
      return translations.types.find(item => {
        return item.type === place.place_type.type;
      }).translations.el;
    } catch (e) {
      return null;
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
          `/population-assessments?place.id=${place.id}&_sort=created_at:DESC`,
      );
      let json = await response.json();
      setAssessments(json);
    } catch (e) {}
  }
  async function reportPlace() {
    let token = null;
    try {
      token = await AsyncStorage.getItem('token');
    } catch (e) {
      // saving error
    }
    try {
      let response = await fetch(`${Config.API_URL}/reports/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          place: place.id,
        }),
      });
    } catch (e) {}
  }
  function handleReportClick() {
    reportPlace();
    toggleModal();
  }
  useEffect(() => {
    if (place) {
      getPopulationAssessments();
      try {
        getColorFromURL(Config.DOMAIN_URL + place.profile_image.url).then(
          colors => {
            setDominantColor(colors.primary);
          },
        );
      } catch (e) {
        setDominantColor('#dddddd');
      }
    }

    getTranslations();
  }, [place]);

  if (place) {
    const url = Config.DOMAIN_URL;

    const images = {
      thumbnail: place.profile_image
        ? url + place.profile_image.formats
          ? place.profile_image.formats.thumbnail.url
          : place.profile_image.url
        : null,
      profile: place.profile_image ? url + place.profile_image.url : null,
    };
    return (
      <>
        <ScrollView
          refreshControl={
            <RefreshControl
              enabled
              onRefresh={refreshPlace}
              refreshing={refreshing}
            />
          }>
          <View>
            <View>
              <View
                source={{uri: images.thumbnail}}
                style={{
                  width: width,
                  height: 130,
                  maxHeight: 130,
                  opacity: 0.7,
                  backgroundColor: dominantColor,
                }}>
                <TouchableNativeFeedback
                  onPress={toggleModal}
                  background={TouchableNativeFeedback.Ripple('#f0f0f0', true)}>
                  <View
                    style={{
                      zIndex: 2,
                      backgroundColor: 'white',
                      position: 'absolute',
                      height: 50,
                      width: 50,
                      right: 10,
                      bottom: 10,
                      borderRadius: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <AntDesignIcons name="flag" size={24} color="red" />
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
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
                      {place.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}

                <View style={styles.info}>
                  <Text style={styles.name}>{place.name}</Text>
                  {getTranslatedType(place) ? (
                    <Text style={styles.type}>{getTranslatedType(place)}</Text>
                  ) : null}
                </View>
              </View>
              {place.last_assessment ? (
                <View style={styles.ppl}>
                  <Text style={{margin: 5, fontWeight: 'bold'}}>Πληθυσμός</Text>
                  <PopulationIndicator
                    population={place.last_assessment.assessment}
                  />
                </View>
              ) : null}
            </View>
            {place.estimated_wait_time !== 0 &&
            place.estimated_wait_time !== null ? (
              <View
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  marginLeft: 10,
                  marginTop: 20,
                }}>
                <WaitTime waitTime={place.estimated_wait_time} size="large" />
              </View>
            ) : null}

            {place.description && place.description !== '' ? (
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
                  {place.description}
                </Text>
              </View>
            ) : null}

            <View style={styles.footer}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: 24,
                  marginTop: 20,
                  marginLeft: 10,
                  marginBottom: 15,
                }}>
                Ημερολόγιο
              </Text>
              <View style={styles.footerButtons}>
                {/*<TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerButtonText}>Ιστορικό</Text>
              </TouchableOpacity> */}

                {/*<TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerButtonText}>Button 2</Text>
              </TouchableOpacity> */}
              </View>
              {/*<View style={styles.list}>
                {assessments.length > 0 &&
                  assessments.map(item => (
                    <View style={styles.ListItem} key={item.created_at}>
                      <PopulationIndicator population={item.assessment} />
                      <View
                        style={{
                          marginLeft: 25,
                          height: 40,
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '40%',
                        }}>
                        <Text style={{fontSize: 16, color: '#8c8c8c'}}>
                          Πρίν από {timeSince(new Date(item.created_at))}
                        </Text>
                      </View>
                    </View>
                  ))}
              </View>*/}
              <Calendar
                mode={ownsPlace(place) ? 'edit' : 'view'}
                place={place}
              />
            </View>
          </View>
        </ScrollView>
        <Modal
          isVisible={isReportModalVisible}
          useNativeDriver={true}
          onBackdropPress={() => setReportModalVisible(false)}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                width: '100%',
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 5,
                justifyContent: 'center',
                textAlign: 'center',
              }}>
              <Text style={{alignSelf: 'center', margin: 20, fontSize: 16}}>
                Δείχνει λάθος πληθυσμό το{' '}
                <Text style={{fontWeight: 'bold'}}>{place.name}</Text>;
              </Text>
              <Button
                title={reportMessage}
                disabled={!canReport}
                onPress={handleReportClick}
                color="red"
              />
            </View>
          </View>
        </Modal>
        {ownsPlace(place) ? (
          <FAB
            style={styles.fab}
            icon="pencil-outline"
            color="white"
            onPress={() =>
              navigation.navigate('EditPlace', {
                place: place,
                refreshPlace: refreshPlace,
              })
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
  fab: {
    backgroundColor: '#1bc4f2',
    position: 'absolute',
    margin: 30,
    right: 0,
    bottom: 0,
  },
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
