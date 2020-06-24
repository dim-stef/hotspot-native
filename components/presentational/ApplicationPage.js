/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Button,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {
  TextField,
  FilledTextField,
  OutlinedTextField,
} from 'react-native-material-textfield';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import Modal from 'react-native-modal';
import {UserContext, PlaceContext} from '../Context';
import Login from './Login';

let mapError = 'Πρέπει να διαλέξεις μια περιοχή';

function removeAllElements(array, elem) {
  var index = array.indexOf(elem);
  while (index > -1) {
    array.splice(index, 1);
    index = array.indexOf(elem);
  }
}

function ApplicationForm({navigation}) {
  const placeContext = useContext(PlaceContext);
  const [place, setPlace] = useState({});
  const [name, setName] = useState('');
  const [surName, setSurName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [errors, setErrors] = useState([]);
  const [placeDescription, setPlaceDescription] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  function handleNavigateToMap() {
    navigation.navigate('PlaceSettings', {
      setPlaceDescription: setPlaceDescription,
      setPlace: setPlace,
    });
  }

  async function postApplication(locationId) {
    console.log('in', locationId);
    let token = null;
    try {
      token = await AsyncStorage.getItem('token');
    } catch (e) {
      // saving error
    }
    try {
      let response = await fetch(`${Config.API_URL}/applications/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          manager_name: name,
          phone_number: phoneNumber,
          email: email,
          location: locationId,
        }),
      });
      let json = await response.json();
      console.log(json);
      if (json.id) {
        toggleModal();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function createLocation() {
    let token = null;
    try {
      token = await AsyncStorage.getItem('token');
    } catch (e) {
      // saving error
    }
    try {
      let response = await fetch(`${Config.API_URL}/locations/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(place),
      });
      let json = await response.json();
      console.log('location response', json);
      postApplication(json.id);
    } catch (e) {
      console.log(e);
    }
  }

  function handleSubmit() {
    if (Object.keys(place).length === 0) {
      setErrors([...errors, mapError]);
    } else {
      createLocation();
    }
  }

  function handleModalClose() {
    toggleModal();
    navigation.navigate('Home');
  }

  useEffect(() => {
    //setPlaceDescription(placeContext.place.description);
    if (place) {
      let _errors = errors;
      removeAllElements(_errors, mapError);
      setErrors(_errors);
    }
  }, [errors, place]);

  return (
    <ScrollView>
      <View style={{padding: 10}}>
        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
          Προσωπικά στοιχεία
        </Text>
        <MaterialTextField
          label="Όνομα"
          autoCompleteType="name"
          onChangeText={text => setName(text)}
        />
        <MaterialTextField
          label="Επώνυμο"
          onChangeText={text => setSurName(text)}
        />
        <MaterialTextField
          label="Email"
          autoCompleteType="email"
          onChangeText={text => setEmail(text)}
        />
        <MaterialTextField
          label="Αριθμός τηλεφώνου"
          autoCompleteType="tel"
          onChangeText={text => setPhoneNumber(text)}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'black',
            marginTop: 20,
            marginBottom: 20,
          }}>
          Περιοχή
        </Text>
        <Button
          title={placeDescription ? placeDescription : 'Διαλεξε περιοχη'}
          onPress={handleNavigateToMap}
        />
        {/*<Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'black',
          marginTop: 20,
          marginBottom: 20,
        }}>
        Επιπλέον πληροφορίες
      </Text>
      <MaterialTextField
        label="Αριθμός τηλεφώνου"
        multiline={true}
        characterRestriction={140}
      />*/}
        {errors.length > 0
          ? errors.map(e => {
              return (
                <View
                  style={{
                    backgroundColor: '#ed4337',
                    padding: 20,
                    marginTop: 20,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text style={{color: 'white'}}>{e}</Text>
                </View>
              );
            })
          : null}

        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              backgroundColor: '#1bc4f2',
              padding: 20,
              borderRadius: 50,
              marginTop: 50,
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              ΥΠΟΒΟΛΗ ΔΗΛΩΣΗΣ
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal isVisible={isModalVisible}>
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
          <Button title="Πηγενε με πισω" onPress={handleModalClose} />
        </View>
      </Modal>
    </ScrollView>
  );
}

function MaterialTextField({
  label,
  onChangeText,
  autoCompleteType,
  multiline = false,
  characterRestriction = undefined,
}) {
  const fieldRef = React.createRef();

  function onSubmit() {
    //let {current: field} = this.fieldRef;
  }

  function formatText(text) {
    //console.log(text.replace(/[^+\d]/g, ''));
    //let tet = text.replace(/[^+\d]/g, '');
    return text;
  }

  return (
    <TextField
      onChangeText={onChangeText}
      multiline={multiline}
      characterRestriction={characterRestriction}
      label={label}
      autoCompleteType={autoCompleteType}
      formatText={formatText}
      onSubmitEditing={onSubmit}
      ref={fieldRef}
    />
  );
}
export default ApplicationForm;
