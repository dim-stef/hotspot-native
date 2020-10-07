/* eslint-disable react-hooks/exhaustive-deps */
import Config from 'react-native-config';
import React, {useEffect, useState} from 'react';

export default function useTranslations(type) {
  // index is used for the corresponding translation document
  // E.g index 0 holds translations for place types
  const [loading, setLoading] = useState(true);
  const [translations, setTranslations] = useState([]);
  async function getTranslations() {
    try {
      let response = await fetch(Config.API_URL + '/translations');
      let json = await response.json();
      let translationObject = json.find(tr => tr.translation_type == type);
      setTranslations(translationObject.place_type);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }
  function getTranslatedType(p = 'place_types') {
    if (type == 'place_types') {
      try {
        return translations.types.find(item => {
          return item.type === p.specific_type || item.type === p.type;
        }).translations.el;
      } catch (e) {
        //console.log(e)
        return null;
      }
    } else {
      try {
        return translations.types.find(item => {
          return item.type === p;
        }).translations.el;
      } catch (e) {
        console.error(e);
        return null;
      }
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
