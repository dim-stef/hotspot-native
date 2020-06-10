/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import Config from "react-native-config";
import 'react-native-gesture-handler';
import React, {useState, useContext, useEffect, useLayoutEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AntDesignIcons from 'react-native-vector-icons/AntDesign';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import AsyncStorage from '@react-native-community/async-storage';
import {UserContext} from './components/Context';
import PlaceList from './components/presentational/PlaceList';
import Test from './components/presentational/Test';
import Search from './components/presentational/SearchButton';
import Login from './components/presentational/Login';
import User from './components/presentational/UserButton';
import PlaceDetails from './components/presentational/PlaceDetails';
//import Home from './components/presentational/Home';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

//<Ionicons name={iconName} size={size} color={color} />
const App: () => React$Node = () => {
  const [isAuth, setAuth] = useState(null);

  async function getUserData() {
    let token = null;
    try {
      token = await AsyncStorage.getItem('token');
    } catch (e) {
      // saving error
    }
    if (token) {
      try {
        let response = await fetch(Config.API_URL + '/users/me', {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);
        setAuth(token);
      } catch (e) {
        try {
          console.log('setting token', token);
          await AsyncStorage.setItem('token', null);
        } catch (e) {}
        setAuth(null);
      }
    }
  }

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <UserContext.Provider value={{isAuth: isAuth, setAuth: setAuth}}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            cardStyle: {backgroundColor: 'white'},
          }}
          initialRouteName="Home"
          activeColor="black"
          inactiveColor="gray"
          barStyle={{backgroundColor: 'white'}}>
          <Stack.Screen
            name="Home"
            component={PlaceList}
            options={({navigation, route}) => ({
              title: 'Αποτελέσματα',
              headerRight: () => (
                <Search title="Info" color="#fff" navigation={navigation} />
              ),
              headerLeft: () => (
                <User
                  onPress={() => alert('This is a button!')}
                  title="Info"
                  color="#fff"
                  navigation={navigation}
                />
              ),
            })}
          />
          <Stack.Screen
            name="Search"
            component={Test}
            options={{title: 'Που θες να πάς;'}}
          />
          <Stack.Screen
            name="PlaceDetails"
            component={PlaceDetails}
            options={{title: 'Λεπτομέρειες'}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{title: 'Λεπτομέρειες'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
