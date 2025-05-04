import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import ThemeContext, { ThemeContextProps } from "../context/ThemeContext";
import Colors from "../components/style/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import FontStyles from "../components/style/fonts";
import BottomBar from "../components/elements/BottomBar";
import LocalizationContext, { LocalizationContextProps } from "../context/LocalizationContext";
import BottomBarContext, { BottomBarContextProps, BottomBarProvider } from "../context/BottomBarContext";
import { MainScreenProps } from "../types/screens";
import MetroTabs from "../components/elements/MetroTabs";
import HistoryScreen from "./screenlets/HistoryScreen";
import SectionTitle from "../components/elements/SectionTitle";
import { t } from "i18next";
import ClocksScreen from "./screenlets/ClocksScreen";
import StopwatchScreen from "./screenlets/StopwatchScreen";

function MainScreenInternal({
    route,
    navigation
}: MainScreenProps): React.JSX.Element {
    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);
    const { locale, setLocale } = useContext<LocalizationContextProps>(LocalizationContext);
    const { setBar, controls, options, hidden } = useContext<BottomBarContextProps>(BottomBarContext);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: Colors[theme].background,
            height: "100%",
            width: "100%"
        },
        itemContainer: {
            //padding: 15,
            paddingBottom: 0,
            flex: 1
        },
        descriptionText: {
            color: Colors[theme].primary,
        },
        accentDescriptionText: {
            color: Colors.accentColor
        }
    });

    return(
        // <BottomBarProvider>
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    <StatusBar
                        barStyle={isDark? "light-content": "dark-content"}
                        backgroundColor={"#ffffff00"}
                        translucent={true}
                    />
                    <SafeAreaView style={{flex: 1}}>
                        <View style={{margin: 15, marginBottom: 0}}>
                            <SectionTitle title={t("common:appName").toUpperCase()}/>
                        </View>
                        <MetroTabs
                            route={route}
                            navigation={navigation}
                            screens={[
                                { title: "clocks", component: ClocksScreen },
                                { title: "alarms", component: HistoryScreen },
                                { title: "stopwatch", component: StopwatchScreen },
                                { title: "timer", component: HistoryScreen },
                            ]}
                        />
                    </SafeAreaView>
                </View>
                <BottomBar controls={controls} options={options} hidden={hidden}/>
            </View>
        // </BottomBarProvider>
    );
}

function MainScreen({
    route,
    navigation
}: MainScreenProps): React.JSX.Element {
    return(
        <BottomBarProvider>
            <MainScreenInternal route={route} navigation={navigation}/>
        </BottomBarProvider>
    )
}

export default MainScreen;