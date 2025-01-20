import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useState, useEffect} from 'react';
import * as Localize from "react-native-localize"
import i18n from '../i18n';

export type LocalizationContextProps = {
  setLocale: (lang: string) => void,
  locale: string
}

const LocalizationContext = createContext<(LocalizationContextProps)>({
  setLocale: (lang: string) => {},
  locale: "en"
});

type Props = {
  children: React.ReactNode
}

export const LocalizationProvider = ({
    children
}: Props) => {
  const [locale, _setLocale] = useState<string>("en");

  function setLocale(lang: string): void {
    _setLocale(lang);
    i18n.changeLanguage(lang);
    AsyncStorage.setItem('locale', lang);
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
    getLocale();
  }, [])
  
  return (
    <LocalizationContext.Provider value={{
      setLocale: setLocale,
      locale: locale
    }}>
      {children}
    </LocalizationContext.Provider>
  );
};
export default LocalizationContext;