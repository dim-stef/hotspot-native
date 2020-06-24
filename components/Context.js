import React from 'react';

export const UserContext = React.createContext({
  isAuth: null,
  setAuth: () => {},
  data: {},
});

export const PlaceContext = React.createContext({
  place: {},
});
