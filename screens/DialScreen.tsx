import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView, NativeModules } from "react-native";
import ThemeContext, { ThemeContextProps } from "../context/ThemeContext";
import Colors from "../components/style/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import FontStyles from "../components/style/fonts";
import BottomBar from "../components/elements/BottomBar";
import TitleSwitcher from "../components/compound/TitleSwitcher";
import LocalizationContext, { LocalizationContextProps } from "../context/LocalizationContext";
import BottomBarContext, { BottomBarContextProps, BottomBarProvider } from "../context/BottomBarContext";
import { DialScreenProps, MainScreenProps } from "../types/screens";
import MetroTabs from "../components/elements/MetroTabs";
import HistoryScreen from "./screenlets/HistoryScreen";

const { DTMFPlaybackModule } = NativeModules;

function DialScreen({
    route,
    navigation
}: DialScreenProps): React.JSX.Element {
    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);
    const { locale, setLocale } = useContext<LocalizationContextProps>(LocalizationContext);

    DTMFPlaybackModule.playDTMFTone(DTMFPlaybackModule.TONE_DTMF_0)

    return(
        <View style={{
            backgroundColor: Colors[theme].background,
            flex: 1
        }}>
            <StatusBar
                barStyle={isDark? "light-content": "dark-content"}
                backgroundColor={"#ffffff00"}
                translucent={true}
            />
            <SafeAreaView style={{flex: 1}}>
                <View style={{
                    padding: 15
                }}>
                    <TitleSwitcher/>
                </View>
            </SafeAreaView>
        </View>
    );
}

export default DialScreen;