/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
import 'react-native-gesture-handler';
import React, {useState, useContext, useEffect, useLayoutEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Picker} from '@react-native-community/picker';
import {UserContext, PlaceContext} from '../Context';
import {Button} from 'react-native-paper';
import ChangePopulationStatus from './ChangePopulationStatus';

const colors = {
  backgroundLow: '#4caf5096',
  backgroundMedium: '#03a9f45e',
  backgroundHigh: '#f403035e',
  textLow: 'green',
  textMedium: '#03a9f4',
  textHigh: '#f44336',
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function EditPlace({navigation, ...rest}) {
  const [waitTime, setWaitTime] = useState(0);
  const [status, setStatus] = useState(
    rest.route.params.place.last_assessment
      ? rest.route.params.place.last_assessment.assessment
      : null,
  );
  const [prevStatus, setPrevStatus] = useState(status);
  async function postStatus() {
    let token = null;
    try {
      token = await AsyncStorage.getItem('token');
    } catch (e) {
      // saving error
    }
    try {
      let response = await fetch(`${Config.API_URL}/population-assessments/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assessment: status,
          place: rest.route.params.place.id,
        }),
      });
      let json = await response.json();
    } catch (e) {}
  }

  async function postWaitTime(value) {
    let token = null;
    try {
      token = await AsyncStorage.getItem('token');
    } catch (e) {
      // saving error
    }
    try {
      let response = await fetch(
        `${Config.API_URL}/places/${rest.route.params.place.id}`,
        {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            estimated_wait_time: value,
          }),
        },
      );
      let json = await response.json();
    } catch (e) {}
  }

  useEffect(() => {
    //don't update status on mount
    if (status !== prevStatus) {
      postStatus();
    }
    setPrevStatus(status);
  }, [status]);

  function updateWaitTime(value) {
    postWaitTime(value);
    setWaitTime(value);
  }
  return (
    <SafeAreaView style={{flex: 1, margin: 20}}>
      <Text style={{fontWeight: 'bold', fontSize: 24}}>
        Ανανέωσε τον πληθυσμό
      </Text>
      <Text style={{marginTop: 10, marginBottom: 10}}>
        Για την καλύτερη εμπειρία είναι καλό να ανανεώνεις τον πληθυσμό κάθε 1
        ώρα ή όταν παρατηρείται αλλαγή
      </Text>
      <ChangePopulationStatus status={status} setStatus={setStatus} />
      <Text style={{fontWeight: 'bold', fontSize: 24, marginTop: 20}}>
        Χρόνος αναμονής
      </Text>
      <Text style={{marginTop: 10, marginBottom: 10}}>
        Επίλεξε χρόνο αναμονής σε περίπτωση που εκτιμάτε
      </Text>
      <View
        style={{
          backgroundColor: '#ececec',
          borderRadius: 2,
          marginTop: 10,
          width: '70%',
        }}>
        <Picker
          selectedValue={waitTime}
          style={{height: 50, width: '100%'}}
          onValueChange={(itemValue, itemIndex) => updateWaitTime(itemValue)}>
          <Picker.Item label="Δεν υπάρχει αναμονή" value={0} />
          <Picker.Item label="Λιγότερο απο 5 λεπτά" value={5} />
          <Picker.Item label="Λιγότερο απο 30 λεπτά" value={30} />
        </Picker>
      </View>
      <Text style={{fontWeight: 'bold', fontSize: 24, marginTop: 20}}>
        Ημερολόγιο
      </Text>
      <View>
        <Text style={{marginTop: 10, marginBottom: 10}}>
          Φτιάξε ένα ημερολόγιο
        </Text>
        <Button
          icon="calendar"
          style={{backgroundColor: '#1bc4f2'}}
          mode="contained"
          onPress={() =>
            navigation.navigate('Calendar', {place: rest.route.params.place})
          }>
          Αλλαξε το ημερολογιο
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

export default EditPlace;
