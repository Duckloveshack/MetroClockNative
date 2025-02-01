import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../../components/style/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import FontStyles from "../../components/style/fonts";
import BottomBar from "../../components/elements/BottomBar";
import TitleSwitcher from "../../components/compound/TitleSwitcher";
import LocalizationContext, { LocalizationContextProps } from "../../context/LocalizationContext";
import BottomBarContext, { BottomBarContextProps, BottomBarProvider } from "../../context/BottomBarContext";
import { MainScreenProps } from "../../types/screens";
import { useTranslation } from "react-i18next";
import Button, { ModalButton } from "../../components/elements/Button";
import MetroTabs, { ScreenletAttributes } from "../../components/elements/MetroTabs";
import TestScreen from "../TestScreen";

function HistoryScreen({
    index,
    route,
    navigation
}: ScreenletAttributes): React.JSX.Element {
    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);
    const { locale, setLocale } = useContext<LocalizationContextProps>(LocalizationContext);
    const { setBar, controls, options, hidden } = useContext<BottomBarContextProps>(BottomBarContext);

    return(
        <View style={{
            backgroundColor: Colors[theme].background,
            height: "100%",
            width: "100%",
            padding: 15
        }}>
            <Text style={{ color: Colors[theme].primary }}>hi</Text>
        </View>
    );
}

export default HistoryScreen;