import React from 'react';

export const UserContext = React.createContext({
  isAuth: null,
  setAuth: () => {},
  user: {},
});

export const PlaceContext = React.createContext({
  place: {},
});

export const PlaceTypesContext = React.createContext({
  types: [{value: 'Όλα τα είδη'}],
});
