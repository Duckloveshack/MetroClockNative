import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
import ThemeContext, { ThemeContextProps } from "../context/ThemeContext";
import Colors from "../components/style/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import FontStyles from "../components/style/fonts";
import BottomBar from "../components/elements/BottomBar";
import TitleSwitcher from "../components/compound/TitleSwitcher";
import LocalizationContext, { LocalizationContextProps } from "../context/LocalizationContext";
import BottomBarContext, { BottomBarContextProps, BottomBarProvider } from "../context/BottomBarContext";
import { MainScreenProps } from "../types/screens";
import MetroTabs from "../components/elements/MetroTabs";
import HistoryScreen from "./screenlets/HistoryScreen";

function MainScreen({
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
        <BottomBarProvider>
            <View style={styles.container}>
                <View style={styles.itemContainer}>
                    <StatusBar
                        barStyle={isDark? "light-content": "dark-content"}
                        backgroundColor={"#ffffff00"}
                        translucent={true}
                    />
                    <SafeAreaView style={{flex: 1}}>
                        <View style={{margin: 15, marginBottom: 0}}>
                            <TitleSwitcher/>
                        </View>
                        <MetroTabs
                            route={route}
                            navigation={navigation}
                            screens={[
                                { title: "history", component: HistoryScreen },
                                { title: "speed dial", component: HistoryScreen },
                            ]}
                        />
                    </SafeAreaView>
                </View>
                <BottomBar controls={controls} options={options} hidden={hidden}/>
            </View>
        </BottomBarProvider>
    );
}

export default MainScreen;