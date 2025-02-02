import React, { useContext } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView, Platform } from "react-native";
import ThemeContext, { ThemeContextProps } from "../context/ThemeContext";
import Colors from "../components/style/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import TitleText from "../components/elements/TitleText";
import SectionTitle from "../components/elements/SectionTitle";
import { SettingsScreenProps } from "../types/screens";
import SelectionBox from "../components/elements/SelectionBox";
import FontStyles from "../components/style/fonts";
import { useTranslation } from "react-i18next";
import LocalizationContext from "../context/LocalizationContext";
import Button from "../components/elements/Button";

import appPackage from "../package.json"

type SelectionBoxAttributes = {
    title: string,
    options: Array<{
        name?: string,
        value: string,
        disabled?: boolean
    }>,
    onChange: (value:any) => void,
    fetchValue: () => string
}

function SettingsSelectionBox({
    title="",
    options=[],
    onChange,
    fetchValue,
}: SelectionBoxAttributes): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);
    return (
        <View style={{
            marginVertical: 5
        }}>
            <Text style={[{
                color: Colors[theme].secondary,
                marginBottom: 5
            }, FontStyles.info]}>
                {title}
            </Text>
            <SelectionBox options={options} onChange={onChange} defaultValue={fetchValue()}/>
        </View>
    )
}

function SettingsScreen({
    route,
    navigation
}: SettingsScreenProps): React.JSX.Element {
    const { theme, isDark, setTheme, themeSetting } = useContext<ThemeContextProps>(ThemeContext);
    const { t } = useTranslation(["common", "settings"]);
    const { locale, setLocale } = useContext(LocalizationContext);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: Colors[theme].background,
            height: "100%",
            width: "100%"
        },
        itemContainer: {
            padding: 15,
            paddingBottom: 0,
            flex: 1
        }
    });

    return(
        <View style={styles.container}>
            <View style={styles.itemContainer}>
                <StatusBar
                    barStyle={isDark? "light-content": "dark-content"}
                    backgroundColor={"#ffffff00"}
                    translucent={true}
                />
                <SafeAreaView style={{flex: 1}}>
                    <SectionTitle title={t("common:appName").toUpperCase()}/>
                    <TitleText text={t("settings:settings")}/>
                    <ScrollView>
                        <SettingsSelectionBox 
                            title={t("settings:themeSetting")}
                            options={[
                                { name: t("settings:lightTheme"), value: "light" },
                                { name: t("settings:darkTheme"), value: "dark" },
                                { name: t("settings:systemTheme"), value: "system" },
                            ]}
                            fetchValue={() => {
                                return themeSetting;
                            }}
                            onChange={(theme) => {
                                setTheme(theme);
                            }}
                        />
                        <SettingsSelectionBox 
                            title={t("settings:languageSetting")}
                            options={[
                                { name: t("settings:languageName", { lng: "en" }), value: "en" },
                                { name: t("settings:languageName", { lng: "fr" }), value: "fr" }
                            ]}
                            fetchValue={() => {
                                return locale;
                            }}
                            onChange={(locale) => {
                                setLocale(locale);
                            }}
                        />
                        <Button text="test" onPress={() => { navigation.navigate("Test") }}/>

                        <Text style={[{ color: Colors[theme].secondary }, FontStyles.info]}>
                            Dialer Version: {appPackage.version} {"\n"}
                            Android API Level: {Platform.Version} {"\n"}
                            React Native Version: {Platform.constants.reactNativeVersion.major}.{Platform.constants.reactNativeVersion.minor}.{Platform.constants.reactNativeVersion.patch} {"\n"}
                        </Text>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </View>
    );
}

export default SettingsScreen;