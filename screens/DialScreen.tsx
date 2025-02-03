import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView, NativeModules, TouchableWithoutFeedback, useWindowDimensions } from "react-native";
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
import NativeDTMF from "../specs/NativeDTMF";
import MetroTouchable from "../components/elements/MetroTouchable";
import { useSharedValue } from "react-native-reanimated";

const BUTTON_GAP = 3;

type DialButtonlikeAttributes = {
    tone?: number,
    onPress?: () => void,
    onLongPress?: () => void
    children: React.ReactNode
}

function DialButtonlike({
    tone,
    onPress,
    onLongPress,
    children
}: DialButtonlikeAttributes) {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    const buttonColor = useSharedValue(Colors[theme].middleground);

    return (
        <MetroTouchable
            touchSoundDisabled
            style={{
                flex: 1,
                backgroundColor: buttonColor
            }}
            onPress={() => {
                if (tone) NativeDTMF.playDTMFTone(tone, 200);
                if (onPress) onPress();
            }}
            onPressIn={() => { buttonColor.value = Colors.accentColor }}
            onPressOut={() => { buttonColor.value = Colors[theme].middleground }}
            onLongPress={() => { if (onLongPress) onLongPress() }}
        >
            <View>
                {children}
            </View>
        </MetroTouchable>
    )
}

type DialButtonAttributes = {
    text: string,
    subtext?: string,
    tone?: number,
    onPress?: () => void,
    onLongPress?: () => void
}

function DialButton({
    text,
    subtext,
    tone,
    onPress,
    onLongPress
}: DialButtonAttributes) {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    return (
        <DialButtonlike onPress={onPress} onLongPress={onLongPress} tone={tone}>
            <View
                style={{
                    justifyContent: "space-around",
                    flexDirection: "row",
                    height: "100%"
                }}
            >
                <Text style={[{
                    color: Colors[theme].primary,
                    verticalAlign: "middle",
                    textAlign: "right",
                    marginEnd: 5,
                    flex: 5
                }, FontStyles.dialButton]}>
                    {text}
                </Text>
                <Text style={[{
                    color: Colors[theme].secondary,
                    verticalAlign: "middle",
                    marginEnd: "auto",
                    marginStart: 5,
                    flex: 6
                }, FontStyles.info]}>
                    {subtext}
                </Text>
            </View>
        </DialButtonlike>
    )
}

function DialStarButton({
    onPress
}: { onPress?: () => void }) {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    return (
        <DialButtonlike onPress={onPress} tone={NativeDTMF.getConstants().TONE_DTMF_STAR}>
            <View
                style={{
                    justifyContent: "space-around",
                    flexDirection: "row",
                    height: "100%"
                }}
            >
                <Text style={[{
                    color: Colors[theme].primary,
                    marginTop: 10
                }, FontStyles.dialButtonStar]}>
                    *
                </Text>
            </View>
        </DialButtonlike>
    )
}

function DialPoundButton({
    onPress
}: { onPress?: () => void }) {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    return (
        <DialButtonlike onPress={onPress} tone={NativeDTMF.getConstants().TONE_DTMF_9}>
            <View
                style={{
                    justifyContent: "space-around",
                    flexDirection: "row",
                    height: "100%"
                }}
            >
                <Text style={[{
                    color: Colors[theme].primary,
                    verticalAlign: "middle",
                }, FontStyles.dialButton]}>
                    #
                </Text>
            </View>
        </DialButtonlike>
    )
}

function DialScreen({
    route,
    navigation
}: DialScreenProps): React.JSX.Element {
    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);
    const { locale, setLocale } = useContext<LocalizationContextProps>(LocalizationContext);

    const [ dialedNumber, setDialedNumber ] = useState<string>("");

    //NativeDTMF.playDTMFTone(NativeDTMF.getConstants().TONE_DTMF_STAR, 200);
    const {height, width} = useWindowDimensions();
    const isLandscape = width > height;

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
                <View style={{flex: 1, flexDirection: isLandscape? "row": "column"}}>
                    <View style={{flex: 5, paddingHorizontal: 10}}>
                        <Text style={[{
                            color: Colors[theme].primary
                        }, FontStyles.title]}>
                            {dialedNumber}
                        </Text>
                    </View>
                    <View style={{
                        flex: 7,
                        gap: BUTTON_GAP,
                        flexDirection: isLandscape? "row": "column"
                    }}>
                        <View
                            style={{
                                flex: isLandscape? 5: 4,
                                gap: BUTTON_GAP,
                            }}
                        >
                            <View style={{
                                flexDirection: "row",
                                gap: BUTTON_GAP,
                                flex: 1
                            }}>
                                <DialButton text="1" tone={NativeDTMF.getConstants().TONE_DTMF_1} onPress={() => setDialedNumber(dialedNumber + "1")}/>
                                <DialButton text="2" subtext="ABC" tone={NativeDTMF.getConstants().TONE_DTMF_2} onPress={() => setDialedNumber(dialedNumber + "2")}/>
                                <DialButton text="3" subtext="DEF" tone={NativeDTMF.getConstants().TONE_DTMF_3} onPress={() => setDialedNumber(dialedNumber + "3")}/>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                gap: BUTTON_GAP,
                                flex: 1
                            }}>
                                <DialButton text="4" subtext="GHI" tone={NativeDTMF.getConstants().TONE_DTMF_4} onPress={() => setDialedNumber(dialedNumber + "4")}/>
                                <DialButton text="5" subtext="JKL" tone={NativeDTMF.getConstants().TONE_DTMF_5} onPress={() => setDialedNumber(dialedNumber + "5")}/>
                                <DialButton text="6" subtext="MNO" tone={NativeDTMF.getConstants().TONE_DTMF_6} onPress={() => setDialedNumber(dialedNumber + "6")}/>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                gap: BUTTON_GAP,
                                flex: 1
                            }}>
                                <DialButton text="7" subtext="PQRS" tone={NativeDTMF.getConstants().TONE_DTMF_7} onPress={() => setDialedNumber(dialedNumber + "7")}/>
                                <DialButton text="8" subtext="TUV" tone={NativeDTMF.getConstants().TONE_DTMF_8} onPress={() => setDialedNumber(dialedNumber + "8")}/>
                                <DialButton text="9" subtext="WXYZ" tone={NativeDTMF.getConstants().TONE_DTMF_9} onPress={() => setDialedNumber(dialedNumber + "9")}/>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                gap: BUTTON_GAP,
                                flex: 1
                            }}>
                                <DialStarButton onPress={() => setDialedNumber(dialedNumber + "*")}/>
                                <DialButton text="0" subtext="+" tone={NativeDTMF.getConstants().TONE_DTMF_0} onPress={() => setDialedNumber(dialedNumber + "0")} onLongPress={() => setDialedNumber(dialedNumber + "+")}/>
                                <DialPoundButton onPress={() => setDialedNumber(dialedNumber + "#")}/>
                            </View>
                        </View>
                        <View style={{
                            flexDirection: isLandscape? "column": "row",
                            gap: BUTTON_GAP,
                            flex: 1
                        }}>
                            <DialButton text="1"/>
                            <DialButton text="2"/>
                            <DialButton text="3"/>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

export default DialScreen;