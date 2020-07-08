/* eslint-disable react-hooks/exhaustive-deps */
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
  Dimensions,
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
import DocumentPicker from 'react-native-document-picker';

let mapError = 'Πρέπει να διαλέξεις περιοχή';
let shouldNotBeEmptyError = 'Υποχρεωτικό πεδίο';

function removeAllElements(array, elem) {
  let index = array.indexOf(elem);
  while (index > -1) {
    array.splice(index, 1);
    index = array.indexOf(elem);
  }
}

function ApplicationForm({navigation}) {
  const dimensions = Dimensions.get('window');
  const placeContext = useContext(PlaceContext);
  const userContext = useContext(UserContext);
  const [place, setPlace] = useState({});
  const [name, setName] = useState(null);
  const [surName, setSurName] = useState(null);
  const [email, setEmail] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [placeName, setPlaceName] = useState(null);
  const [errors, setErrors] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [documents, setDocuments] = useState([]);
  const [placeImage, setPlaceImage] = useState(null);
  const [placeDescription, setPlaceDescription] = useState('');
  const [description, setDescription] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  function handleNavigateToMap() {
    navigation.navigate('PlaceSettings', {
      setPlaceDescription: setPlaceDescription,
      setPlace: setPlace,
    });
  }

  function handleDocumentPicker() {
    getDocuments();
  }

  async function pickProfileImage() {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      setPlaceImage(res);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  async function getDocuments() {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      setDocuments([...documents, ...results]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  async function postApplication(locationId) {
    loadingButton.showLoading(true);
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
      if (json.id) {
        toggleModal();
        loadingButton.showLoading(false);
      }
    } catch (e) {
      loadingButton.showLoading(false);
      console.log(e);
    }
  }

  async function getOrCreateLocation() {
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
      return json.id;
    } catch (e) {
      console.log(e);
    }
    return null;
  }
  function handleSubmit() {
    if (Object.keys(place).length === 0) {
      setErrors([...errors, mapError]);
    } else {
      //createLocation();
    }
  }

  function handleModalClose() {
    toggleModal();
    //navigation.navigate('Home');
  }

  useEffect(() => {
    let _errors = errors;
    if (Object.keys(place).length !== 0) {
      removeAllElements(_errors, mapError);
      setErrors(_errors);
    }
    checkForErrors();
  }, [errors, place, name, surName, email, phoneNumber, placeName]);

  function checkForErrors() {
    let _errors = fieldErrors;
    _errors = handleFieldErrors(name, 'name', shouldNotBeEmptyError, _errors);
    _errors = handleFieldErrors(
      surName,
      'surName',
      shouldNotBeEmptyError,
      _errors,
    );
    _errors = handleFieldErrors(email, 'email', shouldNotBeEmptyError, _errors);
    _errors = handleFieldErrors(
      phoneNumber,
      'phoneNumber',
      shouldNotBeEmptyError,
      _errors,
    );
    _errors = handleFieldErrors(
      placeName,
      'placeName',
      shouldNotBeEmptyError,
      _errors,
    );

    setFieldErrors(_errors);
  }
  function handleFieldErrors(value, key, error, _errors) {
    if (value) {
      _errors = {..._errors, [key]: null};
    } else {
      _errors = {..._errors, [key]: error};
    }
    return _errors;
  }

  async function onSubmit() {
    if (Object.keys(place).length === 0) {
      if (!errors.includes(mapError)) {
        setErrors([...errors, mapError]);
      }
      return;
    }
    let token = null;
    try {
      token = await AsyncStorage.getItem('token');
    } catch (e) {
      // saving error
    }
    const formData = new FormData();
    if (documents) {
      documents.forEach(file => {
        formData.append('files.documents', {
          uri: file.uri,
          type: file.type,
          name: file.name,
        });
      });
    }

    if (placeImage) {
      formData.append('files.place_avatar', {
        uri: placeImage.uri,
        type: placeImage.type,
        name: placeImage.name,
      });
    }
    const data = {};
    data.place_name = placeName;
    data.manager_name = name;
    data.manager_surname = surName;
    data.phone_number = phoneNumber;
    data.email = email;
    data.user = userContext.user.id;

    let locationId = await getOrCreateLocation();
    data.location = locationId;
    formData.append('data', JSON.stringify(data));
    try {
      loadingButton.showLoading(true);
      let response = await fetch(Config.API_URL + '/applications', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      let data = await response.json();
      if (response.status !== 400) {
        toggleModal();
      }
      loadingButton.showLoading(false);
    } catch (e) {
      loadingButton.showLoading(false);
      console.log(e);
    }
  }
  return (
    <ScrollView>
      <View style={{padding: 10}}>
        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
          Προσωπικά στοιχεία
        </Text>
        <MaterialTextField
          label="Όνομα"
          autoCompleteType="name"
          onFocus={checkForErrors}
          onChangeText={text => setName(text)}
          error={fieldErrors.name}
        />
        <MaterialTextField
          label="Επώνυμο"
          onFocus={checkForErrors}
          onChangeText={text => setSurName(text)}
          error={fieldErrors.surName}
        />
        <MaterialTextField
          label="Email"
          autoCompleteType="email"
          onChangeText={text => setEmail(text)}
          error={fieldErrors.email}
        />
        <MaterialTextField
          label="Αριθμός τηλεφώνου"
          autoCompleteType="tel"
          onChangeText={text => setPhoneNumber(text)}
          error={fieldErrors.phoneNumber}
        />
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'black',
            marginTop: 20,
            marginBottom: 20,
          }}>
          Στοιχεία μέρους
        </Text>

        {placeImage ? (
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              resizeMode="cover"
              source={{uri: placeImage.uri}}
              style={{
                width: 200,
                height: 200,
                marginBottom: 10,
                borderRadius: 200,
              }}
            />
          </View>
        ) : null}
        <Button
          title={placeImage ? 'Αλλαγη φωτογραφιας' : 'Φωτογραφια προφιλ'}
          onPress={pickProfileImage}
        />
        <MaterialTextField
          label="Όνομα μέρους"
          error={fieldErrors.placeName}
          onChangeText={text => setPlaceName(text)}
        />
        <MaterialTextField
          label="Περιέγραψε το μέρος (προαιρετικό)"
          onChangeText={text => setDescription(text)}
          multiline
          characterRestriction={140}
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
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: 'black',
            marginTop: 20,
            marginBottom: 10,
          }}>
          Επιβεβαίωση ιδιοκτησίας
        </Text>
        <Text
          style={{
            fontSize: 16,
            color: 'black',
            marginBottom: 10,
          }}>
          Βάλε κάποια στοιχεία (φώτογραφιες) που να επιβεβαιώνουν την ιδιοκτησία
          σου
        </Text>
        {documents.length > 0 ? (
          <View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: 'black',
                marginBottom: 10,
              }}>
              {documents.length} επιλεγμένα αρχεία
            </Text>
            <View
              style={{
                justifyContent: 'space-between',
                flexDirection: 'row',
                flexWrap: 'wrap',
                width: '100%',
              }}>
              {documents.map((d, i) => {
                return (
                  <Image
                    resizeMode="cover"
                    key={i}
                    source={{uri: d.uri}}
                    style={{
                      width: dimensions.width / 2.2,
                      height: 200,
                      marginBottom: 10,
                    }}
                  />
                );
              })}
            </View>
          </View>
        ) : null}
        <Button title="Διαλεξε αρχεια" onPress={handleDocumentPicker} />
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
          <View style={{marginTop: 30}}>
            <AnimateLoadingButton
              ref={c => setLoadingButton(c)}
              width={200}
              height={50}
              title="Υποβολή δήλωσης"
              titleFontSize={16}
              titleColor="rgb(255,255,255)"
              backgroundColor="#0E86D4"
              borderRadius={100}
              onPress={onSubmit}
            />
          </View>
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
  onBlur,
  onFocus,
  error,
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
      onFocus={onFocus}
      onBlur={onBlur}
      onChangeText={onChangeText}
      multiline={multiline}
      characterRestriction={characterRestriction}
      label={label}
      autoCompleteType={autoCompleteType}
      formatText={formatText}
      onSubmitEditing={onSubmit}
      ref={fieldRef}
      error={error}
    />
  );
}
export default ApplicationForm;
