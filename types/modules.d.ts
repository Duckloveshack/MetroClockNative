import { CountryCode } from 'libphonenumber-js'
import 'react-native'

export interface DTMFPlaybackInterface {
    TONE_DTMF_0: number,
    TONE_DTMF_1: number,
    TONE_DTMF_2: number,
    TONE_DTMF_3: number,
    TONE_DTMF_4: number,
    TONE_DTMF_5: number,
    TONE_DTMF_6: number,
    TONE_DTMF_7: number,
    TONE_DTMF_8: number,
    TONE_DTMF_9: number,
    TONE_DTMF_STAR: number,
    TONE_DTMF_POUND: number,

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