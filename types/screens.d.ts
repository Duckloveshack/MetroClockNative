import type { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
    Test: undefined,
    SettingsScreen: undefined,
    ModalScreen: {
        title: string,
        subtitle?: string,
        components?: React.ReactNode
    }
}

export type TestScreenProps = StackScreenProps<
    RootStackParamList,
    "Test"
>

export type SettingsScreenProps = StackScreenProps<
    RootStackParamList,
    "SettingsScreen"
>

export type ModalScreenProps = StackScreenProps<
    RootStackParamList,
    "ModalScreen"
>