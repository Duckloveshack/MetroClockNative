import { CountryCode } from 'libphonenumber-js'
import 'react-native'

export interface DTMFPlaybackInterface {
    playDTMFTone: (digit: number, duration?: number) => void
}

export interface MiscBridgeInterface {
    getAccentColor: () => string,
    exitApp: () => void
}

export interface CallInterface {
    CALL_TYPE_INCOMING: number,
    CALL_TYPE_OUTGOING: number,
    CALL_TYPE_MISSED: number,
    CALL_TYPE_VOICEMAIL: number,
    CALL_TYPE_REJECTED: number,
    CALL_TYPE_BLOCKED: number,
    CALL_TYPE_ANSWERED_EXTERNALLY: number,

    async fetchCallLogs: (count?: number) => Promise<Array<{
        cached_name: string
        country_iso: CountryCode,
        date: number,
        duration: number,
        number: string,
        type: number
    }>>
}

declare module 'react-native' {
    interface NativeModulesStatic {
        DTMFPlaybackModule: DTMFPlaybackInterface
        MiscBridgeModule: MiscBridgeInterface,
        CallModule: CallInterface
    }
}