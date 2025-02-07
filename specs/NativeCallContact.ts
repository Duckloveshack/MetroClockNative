import { CountryCode } from "libphonenumber-js";
import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";
import { EventEmitter } from "react-native/Libraries/Types/CodegenTypes";

export interface Spec extends TurboModule {
    getConstants: () => {
        CALL_TYPE_INCOMING: number,
        CALL_TYPE_OUTGOING: number,
        CALL_TYPE_MISSED: number,
        CALL_TYPE_VOICEMAIL: number,
        CALL_TYPE_REJECTED: number,
        CALL_TYPE_BLOCKED: number,
        CALL_TYPE_ANSWERED_EXTERNALLY: number,
    }

    fetchCallLogs(count: number): Promise<Array<{
        cached_name: string
        country_iso: CountryCode,
        date: number,
        duration: number,
        number: string,
        type: number
    }>>

    readonly onReceiveCall: EventEmitter<number>
}

export default TurboModuleRegistry.getEnforcing<Spec>(
    'NativeCallContact'
)