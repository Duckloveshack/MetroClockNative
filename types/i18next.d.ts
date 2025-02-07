import "i18next";
// import all namespaces (for the default language, only)
import common from "../locales/en/common.json";
import settings from "../locales/en/settings.json"
import dialpad from "../locales/en/dialpad.json"

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "common";
    // custom resources type
    resources: {
      common: typeof common;
      settings: typeof settings;
      dialpad: typeof dialpad;
    };
    // other
  }
}