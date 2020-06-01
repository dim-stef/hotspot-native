/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler';
import React from 'react';
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
import PlaceList from './components/presentational/PlaceList';
import Test from './components/presentational/Test';
import Search from './components/presentational/SearchButton';
import PlaceDetails from './components/presentational/PlaceDetails';
//import Home from './components/presentational/Home';

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

//<Ionicons name={iconName} size={size} color={color} />
const App: () => React$Node = () => {
  return (
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
              <Search
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
      </Stack.Navigator>
    </NavigationContainer>
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
