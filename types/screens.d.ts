import type { StackScreenProps } from "@react-navigation/stack";

export type RootStackParamList = {
    Splash: undefined,
    MainScreen: undefined,
    CityPickScreen: undefined,
    SettingsScreen: undefined,
    ModalScreen: {
        title: string,
        subtitle?: string,
        components?: React.ReactNode
    }
}

export type SplashScreenProps = StackScreenProps<
    RootStackParamList,
    "Splash"
>

export type MainScreenProps = StackScreenProps<
    RootStackParamList,
    "MainScreen"
>

export type CityPickScreenProps = StackScreenProps<
    RootStackParamList,
    "CityPickScreen"
>

export type SettingsScreenProps = StackScreenProps<
    RootStackParamList,
    "SettingsScreen"
>

export type ModalScreenProps = StackScreenProps<
    RootStackParamList,
    "ModalScreen"
>