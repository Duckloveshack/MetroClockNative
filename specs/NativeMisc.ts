import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
    getAccentColor(): string,
    exitApp(): void
}

export default TurboModuleRegistry.getEnforcing<Spec>(
    'NativeMisc'
)