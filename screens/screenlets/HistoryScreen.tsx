import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView, NativeModules } from "react-native";
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
import Icon from "@react-native-vector-icons/foundation";
import RoundedButton from "../../components/elements/RoundedButton";
import { AsYouType, CountryCode } from "libphonenumber-js";

function HistoryScreen({
    index,
    currentIndex,
    route,
    navigation
}: ScreenletAttributes): React.JSX.Element {
    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);
    const { locale, setLocale } = useContext<LocalizationContextProps>(LocalizationContext);
    const { setBar } = useContext<BottomBarContextProps>(BottomBarContext);

    const [ callList, setCallList ] = useState<Array<{
        cached_name: string
        country_iso: CountryCode,
        date: number,
        duration: number,
        number: string,
        type: number
    }>>();

    useEffect(() => {
        NativeModules.CallModule.fetchCallLogs(20)
            .then((result) => {
                setCallList(result)
            })
            .catch((error) => {
                console.error("umm", error)
            });
    }, [])

    return(
        <View style={{
            backgroundColor: Colors[theme].background,
            height: "100%",
            width: "100%",
            // padding: 15
        }}>
            <ScrollView>
            {callList?.map((call, index) => {
                // <View style={{ marginBottom: 10}}>
                //     <Text style={{ color: Colors[theme].primary }}>{call.cached_name || call.number}</Text>
                //     <Text style={{ color: Colors[theme].primary }}>Date: {new Date(call.date).toLocaleDateString()} {new Date(call.date).toLocaleTimeString()}</Text>
                // </View>
                const type = (() => {
                    switch (call.type) {
                        case NativeModules.CallModule.CALL_TYPE_INCOMING: {
                            return "Incoming"
                        }
                        case NativeModules.CallModule.CALL_TYPE_OUTGOING: {
                            return "Outgoing"
                        }
                        case NativeModules.CallModule.CALL_TYPE_MISSED: {
                            return "Missed"
                        }
                        default: {
                            return "Unknown"
                        }
                    }
                })();

                const dateObject = new Date(call.date)

                const dateStringDay = dateObject.toLocaleDateString("en-US", {
                    weekday: "short",
                })

                const dateStringTime = dateObject.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true
                }).toLowerCase().replaceAll(" ", "").slice(0, -1);

                return (
                    <View key={index} style={{
                        paddingVertical: 5,
                        paddingHorizontal: 15
                    }}>
                        <View style={{
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                            <Text style={[{
                                color: Colors[theme].primary,
                            }, FontStyles.objectTitle]}>
                                {call.cached_name || new AsYouType(call.country_iso || "US").input(call.number)}
                            </Text>
                            <RoundedButton icon="torsos"/>
                        </View>
                        <Text style={[{
                            color: Colors[theme].secondary,
                            marginTop: -5
                        }, FontStyles.info]}>
                            {type}, {dateStringDay} {dateStringTime}
                        </Text>
                    </View>
                )
            })}
            </ScrollView>
        </View>
    );
}

export default HistoryScreen;