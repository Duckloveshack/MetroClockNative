import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView, NativeModules, TouchableWithoutFeedback, useWindowDimensions, StyleProp, ViewStyle, TextInput, Keyboard, KeyboardType, NativeSyntheticEvent, TextInputKeyPressEventData, Linking } from "react-native";
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
import { useTranslation } from "react-i18next";
import Icon from "@react-native-vector-icons/material-icons";
import { formatNumber } from "../context/NumberContext";
import Orientation, { LANDSCAPE, OrientationType, PORTRAIT, PORTRAIT_UPSIDE_DOWN, useOrientationChange } from "react-native-orientation-locker";
import NativeCallReceiver from "../specs/NativeCallReceiver";

const BUTTON_GAP = 3;

type DialButtonlikeAttributes = {
    tone?: number,
    disabled?: boolean
    onPress?: () => void,
    onLongPress?: () => void
    children: React.ReactNode,
    style?: StyleProp<ViewStyle>
}

function DialButtonlike({
    tone,
    disabled = false,
    onPress,
    onLongPress,
    children,
    style
}: DialButtonlikeAttributes): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    const buttonColor = useSharedValue(Colors[theme].middleground);

    return (
        <MetroTouchable
            touchSoundDisabled
            style={[{
                flex: 1,
                backgroundColor: !disabled? buttonColor: Colors[theme].middleground
            }, style]}
            onPress={() => {
                //if (tone) NativeDTMF.playDTMFTone(tone, 200);
                if (onPress) onPress();
            }}
            onPressIn={() => {
                if (tone) NativeDTMF.playDTMFTone(tone, 200);
                buttonColor.value = Colors.accentColor
            }}
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
}: DialButtonAttributes): React.JSX.Element {
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
}: { onPress?: () => void }): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    return (
        <DialButtonlike onPress={onPress} tone={NativeDTMF.getConstants().TONE_DTMF_STAR}>
            <View
                style={{
                    justifyContent: "space-around",
                    height: "100%"
                }}
            >
                <Text style={[{
                    color: Colors[theme].primary,
                    marginBottom: -12,
                    textAlign: "center"
                }, FontStyles.dialButtonStar]}>
                    *
                </Text>
            </View>
        </DialButtonlike>
    )
}

function DialPoundButton({
    onPress
}: { onPress?: () => void }): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    return (
        <DialButtonlike onPress={onPress} tone={NativeDTMF.getConstants().TONE_DTMF_POUND}>
            <View
                style={{
                    justifyContent: "space-around",
                    flexDirection: "row",
                    height: "100%"
                }}
            >
                <Text style={[{
                    color: Colors[theme].primary,
                    verticalAlign: "middle"
                }, FontStyles.dialButton]}>
                    #
                </Text>
            </View>
        </DialButtonlike>
    )
}

function DialSaveButton({
    text,
    onPress,
    number
}: {
    text: string
    onPress: () => void,
    number: string
}):React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    return (
        <DialButtonlike onPress={number.length !== 0? onPress: () => {}} disabled={number.length === 0}>
            <View style={{
                alignItems: "center",
                height: "100%",
                paddingVertical: "auto",
                justifyContent: "center"
            }}>
                <Icon 
                    name="save"
                    color={number.length !== 0? Colors[theme].primary: Colors[theme].secondary}
                    size={25}
                />
                <Text style={[{ color: number.length !== 0? Colors[theme].primary: Colors[theme].secondary }, FontStyles.info]}>
                    {text}
                </Text>
            </View>
        </DialButtonlike>
    )
}

function DialCallButton({
    text,
    onPress,
    number
}: {
    text: string
    onPress: () => void,
    number: string
}):React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    return (
        <DialButtonlike onPress={number.length !== 0? onPress: () => {}} disabled={number.length === 0} style={{ flex: 2.02}}>
            <View style={{
                alignItems: "center",
                height: "100%",
                paddingVertical: "auto",
                justifyContent: "center"
            }}>
                <Text style={[{ color: number.length !== 0? Colors[theme].primary: Colors[theme].secondary }, FontStyles.info]}>
                    {text}
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
    const { t } = useTranslation(["dialpad"]);

    const [ dialedNumber, setDialedNumber ] = useState<string>("");
    //@ts-ignore
    const [ orientation, setOrientation] = useState<OrientationType>(PORTRAIT)
    const deleteInterval = useRef<NodeJS.Timeout>();

    const {height, width} = useWindowDimensions();
    const isLandscape = width > height;

    useOrientationChange((orientation: OrientationType) => {
        setOrientation(orientation);
    })

    NativeCallReceiver.startObserving();

    NativeCallReceiver.onCallChangeState((state) => {
        console.log(`Call state: ${state}`)
    });

    NativeCallReceiver.onScreenCall((number) => {
        console.log(`Phone number: ${number}`)
    })


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
                    flex: 1,
                    flexDirection: orientation === OrientationType.PORTRAIT? "column":
                        orientation === OrientationType["LANDSCAPE-LEFT"]? "row": "row-reverse"
                }}>
                    <View style={{ flex: 3}}>
                        <View style={{ flex: 1, padding: 15}}>
                                <TitleSwitcher/>
                        </View>
                        {/* <TextInput
                            style={[{
                                color: Colors[theme].primary,
                            }, FontStyles.title]}
                            showSoftInputOnFocus={false}
                            autoFocus
                        /> */}
                        <View style={{
                            flex: 5,
                            paddingHorizontal: 15,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="head"
                                style={[{
                                    color: Colors[theme].primary,
                                    flexShrink: 1
                                }, FontStyles.title]}
                            >
                                {formatNumber(dialedNumber)}
                            </Text>
                            {dialedNumber.length !== 0? <TouchableWithoutFeedback
                                onPress={() => { setDialedNumber(dialedNumber.slice(0, -1))}}
                                onPressIn={() => {
                                    deleteInterval.current = setInterval(() => {
                                        setDialedNumber((number) => {
                                            return number.slice(0, -1);
                                        });
                                    }, 200)
                                }}
                                onPressOut={() => { clearInterval(deleteInterval.current) }}
                                delayPressIn={500}
                            >
                                <Icon
                                    name="backspace"
                                    color={Colors[theme].primary}
                                    size={40}
                                    style={{ marginTop: 20, height: 40, paddingStart: 10 }}
                                />
                            </TouchableWithoutFeedback>: <></>}
                        </View>
                    </View>
                        <View
                            style={{
                                flex: isLandscape? 2: 4,
                                gap: BUTTON_GAP,
                            }}
                        >
                            <View style={{
                                flexDirection: "row",
                                gap: BUTTON_GAP,
                                flex: 1
                            }}>
                                <DialButton text="1" subtext={t("b1Label")} tone={NativeDTMF.getConstants().TONE_DTMF_1} onPress={() => setDialedNumber(dialedNumber + "1")}/>
                                <DialButton text="2" subtext={t("b2Label")} tone={NativeDTMF.getConstants().TONE_DTMF_2} onPress={() => setDialedNumber(dialedNumber + "2")}/>
                                <DialButton text="3" subtext={t("b3Label")} tone={NativeDTMF.getConstants().TONE_DTMF_3} onPress={() => setDialedNumber(dialedNumber + "3")}/>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                gap: BUTTON_GAP,
                                flex: 1
                            }}>
                                <DialButton text="4" subtext={t("b4Label")} tone={NativeDTMF.getConstants().TONE_DTMF_4} onPress={() => setDialedNumber(dialedNumber + "4")}/>
                                <DialButton text="5" subtext={t("b5Label")} tone={NativeDTMF.getConstants().TONE_DTMF_5} onPress={() => setDialedNumber(dialedNumber + "5")}/>
                                <DialButton text="6" subtext={t("b6Label")} tone={NativeDTMF.getConstants().TONE_DTMF_6} onPress={() => setDialedNumber(dialedNumber + "6")}/>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                gap: BUTTON_GAP,
                                flex: 1
                            }}>
                                <DialButton text="7" subtext={t("b7Label")} tone={NativeDTMF.getConstants().TONE_DTMF_7} onPress={() => setDialedNumber(dialedNumber + "7")}/>
                                <DialButton text="8" subtext={t("b8Label")} tone={NativeDTMF.getConstants().TONE_DTMF_8} onPress={() => setDialedNumber(dialedNumber + "8")}/>
                                <DialButton text="9" subtext={t("b9Label")} tone={NativeDTMF.getConstants().TONE_DTMF_9} onPress={() => setDialedNumber(dialedNumber + "9")}/>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                gap: BUTTON_GAP,
                                flex: 1
                            }}>
                                <DialStarButton onPress={() => setDialedNumber(dialedNumber + "*")}/>
                                <DialButton text="0" subtext="+" tone={0.1 /* Kotlin weirdness */} onPress={() => setDialedNumber(dialedNumber + "0")} onLongPress={() => setDialedNumber(dialedNumber + "+")}/>
                                <DialPoundButton onPress={() => setDialedNumber(dialedNumber + "#")}/>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                gap: BUTTON_GAP,
                                flex: 1
                            }}>
                                <DialCallButton text={t("callButton")} number={dialedNumber} onPress={() => {}}/>
                                <DialSaveButton text={t("saveButton")} number={dialedNumber} onPress={() => {}}/>
                            </View>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

export default DialScreen;