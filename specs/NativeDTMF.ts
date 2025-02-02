import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
    playDTMFTone(digit: number, duration?: number): void,

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
    TONE_DTMF_POUND: number
}

export default TurboModuleRegistry.getEnforcing<Spec>(
    'NativeDTMF'
)