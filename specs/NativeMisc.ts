import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
    getConstants: () => {
        RESULT_OK: number,
        RESULT_CANCELED: number
    }
    getAccentColor(): string,
    exitApp(): void,
    isDialerRoleAvailable(): boolean,
    isDialerRoleHeld(): boolean,
    requestDialerRole(): Promise<number>,

    startDialActivity(): void,
    startCallActivity(): void
}

export default TurboModuleRegistry.getEnforcing<Spec>(
    'NativeMisc'
)