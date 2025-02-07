import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";
import { EventEmitter } from "react-native/Libraries/Types/CodegenTypes";

export interface Spec extends TurboModule {
    startObserving: () => void,
    stopObserving: () => void,
    readonly onCallChangeState: EventEmitter<string>,
    readonly onScreenCall: EventEmitter<string>
}

export default TurboModuleRegistry.getEnforcing<Spec>(
    'NativeCallReceiver'
)