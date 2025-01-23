import React, { useContext } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import ThemeContext, { ThemeContextProps } from "../context/ThemeContext";
import Colors from "../components/style/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import TitleText from "../components/elements/TitleText";
import { t } from "i18next";
import SectionTitle from "../components/elements/SectionTitle";
import { SettingsScreenProps } from "../types/screens";
import SelectionBox from "../components/elements/SelectionBox";
import FontStyles from "../components/style/fonts";

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
            marginBottom: 10
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
                            title={t("settings:theme")}
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
                    </ScrollView>
                </SafeAreaView>
            </View>
        </View>
    );
}

export default SettingsScreen;