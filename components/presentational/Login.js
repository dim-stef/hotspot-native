/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useContext} from 'react';
import {View, Text, TextInput, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {UserContext} from '../Context';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null);
  const userContext = useContext(UserContext);

  function handleClick() {
    loadingButton.showLoading(true);

    handleLogin();
  }

  async function handleLogin() {
    console.log(email, password);
    let response = await fetch('http://192.168.2.5:1337/auth/local/', {
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

    try {
      let token = await AsyncStorage.setItem('token', content.jwt);
      userContext.setAuth(token);
    } catch (e) {
      // saving error
    }

    try {
      const value = await AsyncStorage.getItem('token');
      console.log(value);
      if (value !== null) {
        // value previously stored
      }
    } catch (e) {
      // error reading value
    }

    console.log(content, email, password);
    loadingButton.showLoading(false);
  }
  return userContext.isAuth ? (
    <Text>Authenticated</Text>
  ) : (
    <View
      style={{
        height: '100%',
        margin: 20,
        alignItems: 'center',
      }}>
      <View style={{marginTop: 80, marginBottom: 30, alignItems: 'center'}}>
        <Image
          source={{
            uri: 'https://westeria.app/static/android-chrome-192x192.png',
          }}
          style={{height: 100, width: 100}}
        />
        <Text style={{fontWeight: 'bold', fontSize: 20}}>Tsekit</Text>
      </View>
      <InputWrapper name="Email">
        {/*<AntDesignIcons
          name="user"
          size={16}
          color="#c7c7c7"
          style={{paddingLeft: 10}}
        />*/}
        <TextInput
          autoCompleteType="email"
          onChangeText={value => setEmail(value)}
          style={{paddingLeft: 10, width: '80%'}}
          placeholder="Βάλε email"
        />
      </InputWrapper>
      <InputWrapper name="Email">
        {/*<AntDesignIcons
          name="password"
          size={16}
          color="#c7c7c7"
          style={{paddingLeft: 10}}
        />*/}
        <TextInput
          secureTextEntry={true}
          onChangeText={value => setPassword(value)}
          style={{paddingLeft: 10, width: '80%'}}
          placeholder="Βάλε κωδικό"
        />
      </InputWrapper>
      <AnimateLoadingButton
        ref={c => setLoadingButton(c)}
        width={100}
        height={50}
        title="Συνδέσου"
        titleFontSize={16}
        titleColor="rgb(255,255,255)"
        backgroundColor="#0E86D4"
        borderRadius={100}
        onPress={handleClick}
      />
    </View>
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
