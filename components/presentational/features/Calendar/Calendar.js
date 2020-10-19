/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useMemo, useEffect} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Button,
} from 'react-native';
import {Text} from 'react-native-paper';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';

import Modal from 'react-native-modal';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PopulationIndicator from '../../PopulationIndicator';
import ChangePopulationStatus from '../../ChangePopulationStatus';

const FirstRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#ff4081'}]} />
);

const SecondRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#673ab7'}]} />
);

const initialLayout = {width: Dimensions.get('window').width, height: 0};
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export default function Calendar({mode = 'edit', place = null, route}) {
  const _place = place || route.params.place;
  const [calendar, setCalendar] = useState(null);
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState(
    [],
    /*[
    {key: 'monday', title: 'Monday'},
    {key: 'tuesday', title: 'Tuesday'},
  ]*/
  );

  async function getCalendar() {
    try {
      let response = await fetch(
        `${Config.API_URL}/calendars?place.id=${_place.id}`,
      );
      let json = await response.json();
      setCalendar(json[0]);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    getCalendar();
  }, []);

  useEffect(() => {
    if (calendar) {
      setRoutes(
        calendar.days.map(d => {
          return {key: d.day, title: capitalizeFirstLetter(d.day)};
        }),
      );
    }
  }, [calendar]);

  return calendar ? (
    <TabView
      renderTabBar={props => (
        <TabBar
          {...props}
          indicatorStyle={{backgroundColor: '#3498db', height: 2}}
          style={{backgroundColor: 'white'}}
          renderLabel={({route, focused, color}) => (
            <Text style={{color: 'black'}}>{route.title.slice(0, 3)}</Text>
          )}
        />
      )}
      navigationState={{index, routes}}
      renderScene={({route}) => {
        if (Math.abs(index - routes.indexOf(route)) > 2) {
          return <View />;
        }
        return (
          <Day
            day={route.key}
            title={route.title}
            mode={mode}
            calendar={calendar.days?.find(d => d.day == route.key)}
            updateCalendar={getCalendar}
          />
        );
      }}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  ) : null;
}

const Day = React.memo(
  ({day, title, mode, calendar, updateCalendar = () => {}}) => {
    const times = useMemo(() => getTimes(), []);
    const [isModalVisible, setModalVisible] = useState(false);
    const [currentTimeStatus, setCurrentTimeStatus] = useState(null);

    // use this to access the displayed text string
    const currentTimestampText = useRef(null);

    // use this to access the actual timestamp object in case it exists
    // that means it can be null
    const currentTimestampAlreadCreated = useRef(null);

    const toggleModal = (calendarTimestamp, time) => {
      // calendarTimestamp might not be set yet by user
      // if thats the case it will be undefined so we have to use the local "time" variable instead
      if (calendarTimestamp) {
        currentTimestampAlreadCreated.current = calendarTimestamp;
        currentTimestampText.current = calendarTimestamp.time;
        setCurrentTimeStatus(
          capitalizeFirstLetter(calendarTimestamp.population),
        );
      } else {
        currentTimestampAlreadCreated.current = null;
        currentTimestampText.current = time;
      }
      setModalVisible(!isModalVisible);
    };

    async function changeOrPostTimestamp(newStatus) {
      if (currentTimestampText) {
        let token = null;
        try {
          token = await AsyncStorage.getItem('token');
        } catch (e) {
          // saving error
        }
        let method = currentTimestampAlreadCreated.current ? 'PUT' : 'POST';
        let url = currentTimestampAlreadCreated.current
          ? `${Config.API_URL}/timestamps/${
              currentTimestampAlreadCreated.current.id
            }/`
          : `${Config.API_URL}/timestamps/`;
        try {
          let response = await fetch(url, {
            method: method,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              day: calendar.id,
              time: currentTimestampText.current + ':00',
              population: newStatus.toLowerCase(),
            }),
          });
          let json = await response.json();
          currentTimestampAlreadCreated.current = json;
          updateCalendar();
        } catch (e) {
          console.error(e);
        }
      }
    }

    function closeModal() {
      setCurrentTimeStatus(null);
      toggleModal();
    }
    function getTimes() {
      let x = 30; //minutes interval
      let _times = []; // time array
      let tt = 0; // start time
      let ap = ['AM', 'PM']; // AM-PM

      //loop to increment the time and push results in array
      for (let i = 0; tt < 24 * 60; i++) {
        let hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
        let mm = tt % 60; // getting minutes of the hour in 0-55 format
        _times[i] =
          ('0' + hh).slice(-2) +
          ':' +
          ('0' + mm).slice(
            -2,
          ); /*+
        ap[Math.floor(hh / 12)]; // pushing data in array in [00:00 - 12:00 AM/PM format]*/
        tt = tt + x;
      }

      // move whole array so the calendar starts at 6:00AM instead of 00:00
      return _times.concat(_times.splice(0, 12));
    }

    //console.log(times);
    return (
      <ScrollView contentContainerStyle={{marginLeft: 20, marginRight: 20}}>
        <View style={{marginTop: 50}}>
          {times.map((time, i) => {
            const timestamp = calendar?.timestamps.find(
              t => t.time == time + ':00',
            );

            return (
              <TouchableOpacity
                onPress={() =>
                  mode == 'edit' ? toggleModal(timestamp, time) : {}
                }
                style={{
                  borderBottomWidth: 1,
                  borderColor: '#f7f7f7',
                  paddingTop: 10,
                  paddingBottom: 10,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View style={{flexGrow: 1, justifyContent: 'center'}}>
                  {i == 0 ? (
                    // Only display this on the first row
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 20,
                        flexGrow: 1,
                        paddingLeft: 3,
                        position: 'absolute',
                        bottom: 50,
                      }}>
                      Ωρα
                    </Text>
                  ) : null}

                  <Text style={{fontSize: 18, color: '#464646'}}>{time}</Text>
                </View>
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  {i == 0 ? (
                    // Only display this on the first row
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: 20,
                        flexGrow: 1,
                        position: 'absolute',
                        // positioning is broken so i manually added this value to center the top row
                        bottom: 64,
                      }}>
                      Κόσμος
                    </Text>
                  ) : null}
                  <View style={{flexDirection: 'row'}}>
                    <View style={{width: 80}}>
                      <PopulationIndicator
                        editCalendarMode
                        population={timestamp?.population}
                      />
                    </View>
                    {mode === 'edit' ? (
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginLeft: 15,
                        }}>
                        <Icon name="pencil" size={18} color="#464646" />
                      </View>
                    ) : null}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <Modal
          isVisible={isModalVisible}
          useNativeDriver
          onBackButtonPress={() => closeModal()}>
          <View
            style={{
              height: 300,
              backgroundColor: 'white',
              justifyContent: 'space-around',
              alignItems: 'center',
              padding: 20,
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Κόσμος στις {currentTimestampText.current}
            </Text>

            <ChangePopulationStatus
              status={currentTimeStatus}
              setStatus={setCurrentTimeStatus}
              onChange={newStatus => changeOrPostTimestamp(newStatus)}
            />
            <Button title="Πήγαινε με πισω" onPress={() => closeModal()} />
          </View>
        </Modal>
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
