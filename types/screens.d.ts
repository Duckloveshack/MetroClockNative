import type { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
    Splash: undefined,
    Test: undefined,
    MainScreen: undefined,
    DialScreen: undefined
    SettingsScreen: undefined,
    ModalScreen: {
        title: string,
        subtitle?: string,
        components?: React.ReactNode
    },
    CallScreen: {
        number: string
    }
}

export type SplashScreenProps = StackScreenProps<
    RootStackParamList,
    "Splash"
>

export type TestScreenProps = StackScreenProps<
    RootStackParamList,
    "Test"
>

export type MainScreenProps = StackScreenProps<
    RootStackParamList,
    "MainScreen"
>

export type DialScreenProps = StackScreenProps<
    RootStackParamList,
    "DialScreen"
>

export type SettingsScreenProps = StackScreenProps<
    RootStackParamList,
    "SettingsScreen"
>

export type ModalScreenProps = StackScreenProps<
    RootStackParamList,
    "ModalScreen"
>

export type CallScreenProps = StackScreenProps<
    RootStackParamList,
    "CallScreen"
>