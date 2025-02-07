import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../../components/style/colors";
import FontStyles from "../../components/style/fonts";
import LocalizationContext, { LocalizationContextProps } from "../../context/LocalizationContext";
import BottomBarContext, { BottomBarContextProps, BottomBarProvider } from "../../context/BottomBarContext";
import { ScreenletAttributes } from "../../components/elements/MetroTabs";
import RoundedButton from "../../components/elements/RoundedButton";
import { AsYouType, CountryCode } from "libphonenumber-js";
import NativeCallContact from "../../specs/NativeCallContact";

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
        NativeCallContact.fetchCallLogs(20)
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
                        case NativeCallContact.getConstants().CALL_TYPE_ANSWERED_EXTERNALLY:
                        case NativeCallContact.getConstants().CALL_TYPE_INCOMING: { return "Incoming" }
                        case NativeCallContact.getConstants().CALL_TYPE_BLOCKED:
                        case NativeCallContact.getConstants().CALL_TYPE_REJECTED:
                        case NativeCallContact.getConstants().CALL_TYPE_OUTGOING: { return "Outgoing" }
                        case NativeCallContact.getConstants().CALL_TYPE_VOICEMAIL:
                        case NativeCallContact.getConstants().CALL_TYPE_MISSED: { return "Missed" }
                        default: { return "Unknown" }
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