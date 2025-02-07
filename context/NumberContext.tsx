//Not really a context per se, but im sticking with naming tradition.

import { AsYouType, CountryCode } from "libphonenumber-js";

export function formatNumber(number:string, preferredISO:CountryCode = "US") {
    return /(.\+)|[#*]/.test(number)? number: new AsYouType(preferredISO).input(number);
}