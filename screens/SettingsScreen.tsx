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
                            title={t("settings:theme.settingName")}
                            options={[
                                { name: t("settings:theme.light"), value: "light" },
                                { name: t("settings:theme.dark"), value: "dark" },
                                { name: t("settings:theme.system"), value: "system" },
                            ]}
                            fetchValue={() => {
                                return themeSetting;
                            }}
                            onChange={(theme) => {
                                setTheme(theme);
                            }}
                        />
                        {/* TODO: make this dynamic */}
                        <SettingsSelectionBox 
                            title={t("settings:language.settingName")}
                            options={[
                                { name: t("settings:language.localName", { lng: "en" }), value: "en" },
                                { name: t("settings:language.localName", { lng: "fr" }), value: "fr" }
                            ]}
                            fetchValue={() => {
                                return locale;
                            }}
                            onChange={(locale) => {
                                setLocale(locale);
                            }}
                        />

                        <Text style={[{ color: Colors[theme].secondary }, FontStyles.info]}>
                            {t("settings:debug.appVersion", { version: appPackage.version })}{"\n"}
                            {t("settings:debug.levelAPI", { version: Platform.Version })} {"\n"}
                            {t("settings:debug.rnVersion", { version: `${Platform.constants.reactNativeVersion.major}.${Platform.constants.reactNativeVersion.minor}.${Platform.constants.reactNativeVersion.patch}` })} {"\n"}
                        </Text>
                    </ScrollView>
                </SafeAreaView>
            </View>
        </View>
    );
}

export default SettingsScreen;