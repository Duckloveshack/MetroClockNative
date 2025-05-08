import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../../components/style/colors";
import FontStyles from "../../components/style/fonts";
import LocalizationContext, { LocalizationContextProps } from "../../context/LocalizationContext";
import BottomBarContext, { BottomBarContextProps, BottomBarProvider } from "../../context/BottomBarContext";
import { ScreenletAttributes } from "../../components/elements/MetroTabs";
import RoundedButton from "../../components/elements/RoundedButton";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

function ClocksScreen({
    index,
    currentIndex,
    route,
    navigation
}: ScreenletAttributes): React.JSX.Element {
    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);
    const { locale, setLocale } = useContext<LocalizationContextProps>(LocalizationContext);
    const { setBar } = useContext<BottomBarContextProps>(BottomBarContext);
    const { t } = useTranslation(["common", "settings"]);

    function clockBar() {
        setBar({
            controls: [
                {
                    icon: "add",
                    string: t("common:button.add"),
                    onPress: () => { navigation.navigate("CityPickScreen"); }
                },
            ],
            options: [
                {
                    string: t("settings:settings"),
                    onPress: () => { navigation.navigate("SettingsScreen"); }
                },
            ],
            hidden: false
        });
    }

    useAnimatedReaction(
        () => currentIndex?.value,
        (curIndex, prevIndex) => {
            if (curIndex == index && curIndex != prevIndex) {
                runOnJS(clockBar)()
            }
        },
        [setBar, t]
    )

    useEffect(() => {
        if (currentIndex?.value == index) {
            clockBar();
        }
    }, [locale])

    return(
        <View style={{
            backgroundColor: Colors[theme].background,
            height: "100%",
            width: "100%",
            // padding: 15
        }}>
            <ScrollView>
                <Text style={{ color: Colors[theme].primary }}>{"ts sucks </3"}</Text>
            </ScrollView>
        </View>
    );
}

export default ClocksScreen;