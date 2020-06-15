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
const colors = {
  backgroundLow: '#4caf5096',
  backgroundMedium: '#03a9f45e',
  backgroundHigh: '#f403035e',
  textLow: 'green',
  textMedium: '#03a9f4',
  textHigh: '#f44336',
};

function EditPlace() {
  const [status, setStatus] = useState(null);

  return (
    <SafeAreaView style={{flex: 1, margin: 20}}>
      <Text style={{fontWeight: 'bold', fontSize: 24}}>
        Ανανέωσε τον πληθυσμό
      </Text>
      <Text style={{marginTop: 10, marginBottom: 10}}>
        Για την καλύτερη εμπειρία προτίνετε να ανανεώνεις τον πληθυσμό κάθε 1
        ώρα ή όταν υπάρχει παρατηρείτε αλλαγή
      </Text>
      <View
        style={{
          flexDirection: 'row',
          padding: 0,
        }}>
        <StatusButton
          status={status}
          value="low"
          label="Λίγος"
          backgroundColor={colors.backgroundLow}
          color={colors.textLow}
          onPress={() => setStatus('low')}
          style={{
            borderTopLeftRadius: 10,
            borderBottomLeftRadius: 10,
            borderRightColor: '#ececec',
            borderRightWidth: 1,
          }}
        />
        <StatusButton
          status={status}
          value="medium"
          label="Μεσαίος"
          backgroundColor={colors.backgroundMedium}
          color={colors.textMedium}
          onPress={() => setStatus('medium')}
          style={{borderRightColor: '#ececec', borderRightWidth: 1}}
        />
        <StatusButton
          status={status}
          value="high"
          label="Πολύς"
          backgroundColor={colors.backgroundHigh}
          color={colors.textHigh}
          onPress={() => setStatus('high')}
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
