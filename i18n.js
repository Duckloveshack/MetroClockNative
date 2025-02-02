import i18next from 'i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import common from "./locales/en/common.json";
import settings from "./locales/en/settings.json";

import fr_common from "./locales/fr/common.json";
import fr_settings from "./locales/fr/settings.json";

i18n
  .use(initReactI18next)
  // i18n is a pain
  //.use(resourcesToBackend((language, namespace) => import(`./locales` + language + `/common.json`)))
  .init({
    resources: {
      en: {
        common: common,
        settings: settings
      },
      fr: {
        common: fr_common,
        settings: fr_settings
      }
    },
    partialBundledLanguages: true,
    lng: 'en',
    supportedLangs: [
      'en', 
      "fr"
    ],
    fallbackLng: "en",
    ns: [
      'common',
      'settings'
    ]
  });


export default i18n;