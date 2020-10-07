/* eslint-disable react-native/no-inline-styles */
import React, {useState, useRef, useMemo} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Button
} from 'react-native';
import {Text} from 'react-native-paper';
import {TabView, SceneMap} from 'react-native-tab-view';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PopulationIndicator from './PopulationIndicator';
import ChangePopulationStatus from './ChangePopulationStatus';

const FirstRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#ff4081'}]} />
);

const SecondRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#673ab7'}]} />
);

const initialLayout = {width: Dimensions.get('window').width};

export default function Calendar({mode = 'edit', place}) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'monday', title: 'Monday'},
    {key: 'tuesday', title: 'Tuesday'},
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={({route}) => (
        <Day day={route.key} title={route.title} mode={mode} />
      )}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
}

function Day({day, title, mode}) {
  const times = useMemo(() => getTimes(), []);
  const [isModalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState('High');

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

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

    return _times;
  }

  console.log(times);
  return (
    <ScrollView contentContainerStyle={{marginLeft: 20, marginRight: 20}}>
      <View style={{marginTop: 50}}>
        {times.map((time, i) => {
          return (
            <TouchableOpacity
              onPress={() => toggleModal()}
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
                    <PopulationIndicator population="high" />
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
      <Modal isVisible={isModalVisible} useNativeDriver>
        <View
          style={{
            height: 200,
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>Ευχαριστούμε!</Text>
          <Text style={{margin: 10, textAlign: 'center', color: '#636363'}}>
            Θα σε ειδοποιήσουμε μετά την επεξεργασία της δήλωσης.
          </Text>
          <ChangePopulationStatus status={status} setStatus={setStatus} />
          <Button title="Πήγαινε με πισω" onPress={()=>toggleModal()} />
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
