import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useState, useEffect} from 'react';
import * as Localize from "react-native-localize"
import i18n from '../i18n';

export type LocalizationContextProps = {
  setLocale: (lang: string) => void,
  locale: string,
  setIs24H: (state: boolean) => void,
  is24H: boolean,
  setShortCityNames: (state: boolean) => void,
  shortCityNames: boolean
}

const LocalizationContext = createContext<(LocalizationContextProps)>({
  setLocale: () => {},
  locale: "en",
  setIs24H: () => {},
  is24H: false,
  setShortCityNames: () => {}, 
  shortCityNames: true
});

type Props = {
  children: React.ReactNode
}

export const LocalizationProvider = ({
    children
}: Props) => {
  const [locale, _setLocale] = useState<string>("en");
  const [is24H, _setIs24H] = useState<boolean>(false);
  const [shortCityNames, _setShortCityNames] = useState<boolean>(false);

  function setLocale(lang: string): void {
    _setLocale(lang);
    i18n.changeLanguage(lang);
    AsyncStorage.setItem('locale', lang);
  }

  function setIs24H(state: boolean): void {
    _setIs24H(state);
    AsyncStorage.setItem('24h', state.toString());
  }

  function setShortCityNames(state: boolean): void {
    _setShortCityNames(state);
    AsyncStorage.setItem('shortnames', state.toString());
  }

  useEffect(() => {
    const getLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem('locale');
        _setLocale(savedLocale || Localize.getLocales()[0].languageCode);
        i18n.changeLanguage(savedLocale || Localize.getLocales()[0].languageCode);
      } catch (error) {
        console.log(error);
      }
    };
    const getIs24H = async () => {
      try {
        const saved24H = await AsyncStorage.getItem('24h');
        _setIs24H(saved24H == "true" || false);
      } catch (err) {
        console.log(err)
      }
    }
    const getShortCityNames = async () => {
      try {
        const savedShort = await AsyncStorage.getItem('shortnames');
        _setShortCityNames(savedShort == "true" || false);
      } catch (err) {
        console.log(err)
      }
    }

    getLocale();
    getIs24H();
    getShortCityNames();
  }, [])
  
  return (
    <LocalizationContext.Provider value={{
      setLocale: setLocale,
      locale: locale,
      setIs24H: setIs24H,
      is24H: is24H,
      setShortCityNames: setShortCityNames,
      shortCityNames: shortCityNames
    }}>
      {children}
    </LocalizationContext.Provider>
  );
};
export default LocalizationContext;