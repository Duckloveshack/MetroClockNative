import type { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
    Test: undefined,
    SettingsScreen: undefined
}

export type TestScreenProps = StackScreenProps<
    RootStackParamList,
    "Test"
>

export type SettingsScreenProps = StackScreenProps<
    RootStackParamList,
    "SettingsScreen"
>