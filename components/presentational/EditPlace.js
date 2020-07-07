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
import {UserContext, PlaceContext} from '../Context';

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
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    //don't update status on mount
    if (status !== prevStatus) {
      postStatus();
    }
    setPrevStatus(status);
  }, [status]);

  return (
    <SafeAreaView style={{flex: 1, margin: 20}}>
      <Text style={{fontWeight: 'bold', fontSize: 24}}>
        Ανανέωσε τον πληθυσμό
      </Text>
      <Text style={{marginTop: 10, marginBottom: 10}}>
        Για την καλύτερη εμπειρία είναι καλό να ανανεώνεις τον πληθυσμό κάθε 1
        ώρα ή όταν παρατηρείται αλλαγή
      </Text>
      <View
        style={{
          flexDirection: 'row',
          padding: 0,
        }}>
        <StatusButton
          status={status}
          value="Low"
          label="Λίγος"
          backgroundColor={colors.backgroundLow}
          color={colors.textLow}
          onPress={() => setStatus('Low')}
          style={{
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            borderRightColor: '#ececec',
            borderRightWidth: 1,
          }}
        />
        <StatusButton
          status={status}
          value="Medium"
          label="Μεσαίος"
          backgroundColor={colors.backgroundMedium}
          color={colors.textMedium}
          onPress={() => setStatus('Medium')}
          style={{borderRightColor: '#ececec', borderRightWidth: 1}}
        />
        <StatusButton
          status={status}
          value="High"
          label="Πολύς"
          backgroundColor={colors.backgroundHigh}
          color={colors.textHigh}
          onPress={() => setStatus('High')}
          style={{borderTopRightRadius: 10, borderBottomRightRadius: 10}}
        />
      </View>
    </SafeAreaView>
  );
}

function StatusButton({
  status,
  value,
  label,
  backgroundColor,
  color,
  onPress,
  style = {},
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        height: 100,
        flexGrow: 1,
        backgroundColor: status === value ? backgroundColor : '#f7f7f7',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}>
      <Text
        style={{
          fontSize: 20,
          color: status === value ? color : 'black',
          fontWeight: 'bold',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});

export default EditPlace;
