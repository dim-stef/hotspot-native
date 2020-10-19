import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-community/async-storage';
import Config from 'react-native-config';

export const getUserData = createAsyncThunk(
  'user/getUserData',
  async credentials => {
    let data = {};
    try {
      let userToken = await AsyncStorage.getItem('token');
      let headers = userToken
        ? {
            Authorization: `Bearer ${userToken}`,
          }
        : {};

      // first get user data from /users/me/
      let url = `${Config.API_URL}/users/me/`;
      let userResponse = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
      let userReponseData = await userResponse.json();
      data = {...userReponseData};

      // then get the users places from from /api/myplaces/
      url = `${Config.API_URL}/api/my_places/`;
      let myPlacesResponse = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
      let myPlacesResponseData = await myPlacesResponse.json();
      data = {...data, ...myPlacesResponseData};
    } catch (e) {}

    return data;
  },
);

export const getUserPlaces = createAsyncThunk(
  'user/getUserPlaces',
  async () => {
    try {
      let userToken = await AsyncStorage.getItem('token');
      let headers = userToken
        ? {
            Authorization: `Bearer ${userToken}`,
          }
        : {};
      // get the user places from from /api/myplaces/
      let url = `${Config.API_URL}/my_places/`;
      let myPlacesResponse = await fetch(url, {
        method: 'GET',
        headers: headers,
      });
      let myPlacesResponseData = await myPlacesResponse.json();
      return myPlacesResponseData;
    } catch (e) {
      console.error(e);
    }
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    myPlaces: [],
    loading: false,
  },
  extraReducers: {
    [getUserPlaces.fulfilled]: (state, action) => {
      state.myPlaces = action.payload;
      state.loading = false;
    },
    [getUserPlaces.pending]: (state, action) => {
      state.loading = true;
    },
    [getUserPlaces.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});
