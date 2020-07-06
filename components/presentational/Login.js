/* eslint-disable react-native/no-inline-styles */
import Config from 'react-native-config';
import React, {useEffect, useState, useContext} from 'react';
import {View, Text, TextInput, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {UserContext} from '../Context';

function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingButton, setLoadingButton] = useState(null);
  const userContext = useContext(UserContext);

  function handleClick() {
    loadingButton.showLoading(true);

    handleLogin();
  }

  async function handleLogin() {
    let response = await fetch(Config.API_URL + '/auth/local/', {
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

function Logout({navigation}) {
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(null);
  const userContext = useContext(UserContext);

  function handleClick() {
    loadingButton.showLoading(true);

    handleLogout();
  }

  function handleLogout() {
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
