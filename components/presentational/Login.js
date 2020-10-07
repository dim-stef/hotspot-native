/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
import React, {useEffect, useState, useContext} from 'react';
import {View, Text, TextInput, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import ErrorText from './ErrorText';
import {UserContext} from '../Context';

function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingButton, setLoadingButton] = useState(null);
  const [error, setError] = useState(false);
  const userContext = useContext(UserContext);

  function handleClick() {
    loadingButton.showLoading(true);

    handleLogin();
  }

  async function handleLogin() {
    let response = await fetch(Config.DOMAIN_URL + '/auth/local', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        identifier: email,
        password: password,
      }),
    });

    const content = await response.json();
    if (content.statusCode === 400) {
      setError(true);
    }
    loadingButton.showLoading(false);

    try {
      let token = await AsyncStorage.setItem('token', content.jwt);
      userContext.setAuth(content.jwt);
      navigation.navigate('Home');
    } catch (e) {
      // saving error
    }
  }

  return userContext.isAuth ? (
    <Logout navigation={navigation} />
  ) : (
    <View
      style={{
        height: '100%',
        margin: 20,
        alignItems: 'center',
      }}>
      <View style={{marginTop: 80, marginBottom: 30, alignItems: 'center'}}>
        <Image
          source={require('../images/logo.png')}
          style={{
            resizeMode: 'contain',
            width: 100,
            height: 100,
            borderRadius: 200,
          }}
        />
        <Text style={{fontWeight: 'bold', fontSize: 20}}>Hotspot</Text>
      </View>
      <InputWrapper name="Email">
        <TextInput
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCompleteType="email"
          onChangeText={value => setEmail(value)}
          style={{paddingLeft: 10, width: '80%'}}
          placeholder="Βάλε email"
        />
      </InputWrapper>
      <InputWrapper name="Password">
        <TextInput
          secureTextEntry={true}
          onChangeText={value => setPassword(value)}
          style={{paddingLeft: 10, width: '80%'}}
          placeholder="Βάλε κωδικό"
        />
      </InputWrapper>
      {error ? <Error error="Το email ή το password είναι λάθος" /> : null}
      <AnimateLoadingButton
        ref={c => setLoadingButton(c)}
        width={200}
        height={50}
        title="Συνδέσου"
        titleFontSize={16}
        titleColor="rgb(255,255,255)"
        backgroundColor="#0E86D4"
        borderRadius={5}
        onPress={handleClick}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={{margin: 20, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Δεν έχεις λογαριασμό;</Text>
        <Text style={{color: '#0645AD', fontWeight: 'bold'}}>
          Δημιούργησε τώρα
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function Register({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingButton, setLoadingButton] = useState(null);
  const [error, setError] = useState(false);
  const userContext = useContext(UserContext);

  function handleClick() {
    loadingButton.showLoading(true);
    handleLogin();
  }

  async function handleLogin() {
    let response = await fetch(Config.DOMAIN_URL + '/auth/local/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        email: email,
        password: password,
      }),
    });

    const content = await response.json();
    loadingButton.showLoading(false);

    if (content.statusCode === 400) {
      setError(true);
    }
    try {
      let token = await AsyncStorage.setItem('token', content.jwt);
      userContext.setAuth(content.jwt);
      navigation.navigate('Home');
    } catch (e) {
      // saving error
    }
  }

  return userContext.isAuth ? (
    <Logout navigation={navigation} />
  ) : (
    <View
      style={{
        height: '100%',
        margin: 20,
        alignItems: 'center',
      }}>
      <View style={{marginTop: 80, marginBottom: 30, alignItems: 'center'}}>
        <Image
          source={require('../images/logo.png')}
          style={{
            height: 100,
            width: 100,
            resizeMode: 'contain',
            borderRadius: 200,
          }}
        />
        <Text style={{fontWeight: 'bold', fontSize: 20}}>Hotspot</Text>
      </View>
      <InputWrapper name="Email">
        <TextInput
          keyboardType="email-address"
          textContentType="emailAddress"
          autoCompleteType="email"
          onChangeText={value => setEmail(value)}
          style={{paddingLeft: 10, width: '80%'}}
          placeholder="Βάλε email"
        />
      </InputWrapper>
      <InputWrapper name="Password">
        <TextInput
          secureTextEntry={true}
          onChangeText={value => setPassword(value)}
          style={{paddingLeft: 10, width: '80%'}}
          placeholder="Βάλε κωδικό"
        />
      </InputWrapper>
      <InputWrapper name="Confirm Password">
        <TextInput
          secureTextEntry={true}
          onChangeText={value => setConfirmPassword(value)}
          style={{paddingLeft: 10, width: '80%'}}
          placeholder="Βάλε κωδικό ξανά"
        />
      </InputWrapper>
      {password !== confirmPassword ? (
        <Error error="Οι κωδικοί δεν ταιριάζουν" />
      ) : null}
      {error ? <Error error="Το email δεν είναι διαθέσιμο" /> : null}
      <AnimateLoadingButton
        ref={c => setLoadingButton(c)}
        width={200}
        height={50}
        title="Συνδέσου"
        titleFontSize={16}
        titleColor="rgb(255,255,255)"
        backgroundColor="#0E86D4"
        borderRadius={5}
        onPress={password !== confirmPassword ? () => {} : () => handleClick()}
      />
    </View>
  );
}

function Error({error}) {
  return (
    <View
      style={{
        backgroundColor: '#ed4337',
        padding: 10,
        margin: 10,
        minWidth: 200,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{color: 'white'}}>{error}</Text>
    </View>
  );
}

function Logout({navigation}) {
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null);
  const userContext = useContext(UserContext);

  function handleClick() {
    loadingButton.showLoading(true);

    handleLogout();
  }

  async function handleLogout() {
    try {
      await AsyncStorage.setItem('token', null);
    } catch (e) {
      // saving error
    }
    userContext.setAuth(null);
    navigation.navigate('Home');
  }

  return (
    <AnimateLoadingButton
      ref={c => setLoadingButton(c)}
      width={100}
      height={50}
      title="Αποσυνδέσου"
      titleFontSize={16}
      titleColor="rgb(255,255,255)"
      backgroundColor="#0E86D4"
      borderRadius={100}
      onPress={handleClick}
    />
  );
}

function InputWrapper({children, name}) {
  return (
    <View
      style={{
        position: 'relative',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#c7c7c7',
        borderWidth: 1,
        borderRadius: 5,
        margin: 10,
      }}>
      <Text
        style={{
          position: 'absolute',
          top: -10,
          left: 10,
          backgroundColor: 'white',
          paddingLeft: 10,
          paddingRight: 10,
          fontWeight: 'bold',
          color: '#383838',
        }}>
        {name}
      </Text>
      {children}
    </View>
  );
}

export default Login;
