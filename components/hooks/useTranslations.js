import Config from 'react-native-config';
import React, {useEffect, useState} from 'react';

export default function useTranslations() {
  const [loading, setLoading] = useState(true);
  const [translations, setTranslations] = useState([]);
  async function getTranslations() {
    try {
      let response = await fetch(Config.API_URL + '/translations');
      let json = await response.json();
      setTranslations(json[0].place_type);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }
  function getTranslatedType(p) {
    try {
      return translations.types.find(item => {
        return item.type === p.specific_type || item.type === p.type;
      }).translations.el;
    } catch (e) {
      //console.log(e)
      return 'Αλλο';
    }
  }

  function getTypeValueFromTranslation(type) {
    try {
      return translations.types.find(item => {
        return Object.keys(item.translations).find(k => {
          return item.translations[k] == type;
        }); //item.type === type;
      }).type;
    } catch (e) {
      return null;
    }
  }

  useEffect(() => {
    //getPlaces();
    getTranslations();
  }, []);

  return [
    translations,
    getTranslatedType,
    getTypeValueFromTranslation,
    loading,
  ];
}
