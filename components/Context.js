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
  lastValue: 'Όλα τα είδη',
});

export const LocationsContext = React.createContext({
  types: [{value: 'Όλες οι περιοχές'}],
  lastValue: 'Όλες οι περιοχές',
});

export const PopulationContext = React.createContext({
  types: [{value: 'Όλοι οι πληθυσμοί'}],
  lastValue: 'Όλες οι περιοχές',
});
