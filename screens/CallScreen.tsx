import React, { useContext, useEffect, useState } from "react";
import { View, Text, StatusBar, useWindowDimensions, StyleProp, ViewStyle } from "react-native";
import ThemeContext, { ThemeContextProps } from "../context/ThemeContext";
import Colors from "../components/style/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import FontStyles from "../components/style/fonts";
import LocalizationContext, { LocalizationContextProps } from "../context/LocalizationContext";
import Animated, { AnimatedStyle, Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import Icon from "@react-native-vector-icons/material-icons";
import glyphMap from "../node_modules/@react-native-vector-icons/material-icons/glyphmaps/MaterialIcons.json"
import { CallButton } from "../components/elements/Button";
import { DialButton, DialPoundButton, DialStarButton } from "./screenlets/DialScreenInternal";
import NativeDTMF from "../specs/NativeDTMF";

const BUTTON_GAP = 4;

function CallScreenButton({
    text,
    icon,
    onPress,
    style
}: {
    text?: string,
    icon: keyof typeof glyphMap,
    onPress?: () => void,
    style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>
}): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    return (
        <CallButton onPress={onPress} style={style}>
            <View style={{
                alignItems: "center",
                height: "100%",
                paddingVertical: "auto",
                justifyContent: "center"
            }}>
                <Icon 
                    name={icon}
                    color={Colors[theme].primary}
                    size={25}
                />
                <Text style={[{ color: Colors[theme].primary, height: text? "auto": 0 }, FontStyles.info]}>
                    {text}
                </Text>
            </View>
        </CallButton>
    )
}

function CallScreenEndButton({
    text,
    onPress,
}: {
    text: string
    onPress: () => void,
}):React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    const textColor = useSharedValue<string>(Colors[theme].primary);
    const bgColor = useSharedValue<string>(Colors.accentColor);

    return (
        <CallButton
            onPress={onPress}
            style={{
                flex: 2.02,
                backgroundColor: bgColor
            }}
            onPressIn={async () => {
                bgColor.value = Colors[theme].primary;
                setTimeout(() => { textColor.value = Colors[theme].background; }, 1);
            }}
            onPressOut={async () => {
                bgColor.value = Colors.accentColor; 
                setTimeout(() => { textColor.value = Colors[theme].primary; }, 1);
            }}
        >
            <View style={{
                alignItems: "center",
                height: "100%",
                paddingVertical: "auto",
                justifyContent: "center",
            }}>
                <Animated.Text style={[{ color: textColor }, FontStyles.info]}>
                    {text}
                </Animated.Text>
            </View>
        </CallButton>
    )
}

function CallScreen({

}): React.JSX.Element {
    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);
    const { locale, setLocale } = useContext<LocalizationContextProps>(LocalizationContext);
    const { t } = useTranslation(["dialpad"]);

    const {height, width} = useWindowDimensions();

    const [dialButtons, setDialButtons] = useState<boolean>(false);
    const [dialedNumber, setDialedNumber] = useState<string>("");
    const callButtonRotation = useSharedValue(0);
    const dialButtonRotation = useSharedValue(90)

    useEffect(() => {
        if (dialButtons) {
            dialButtonRotation.value = 90
            callButtonRotation.value = withTiming(-90, {
                duration: 250,
                easing: Easing.in(Easing.circle)
            });
            dialButtonRotation.value = withDelay(250, 
                withTiming(0, {
                    duration: 250,
                    easing: Easing.out(Easing.circle)
                })
            );
        } else {
            callButtonRotation.value = 90;
            dialButtonRotation.value = withTiming(-90, {
                duration: 250,
                easing: Easing.in(Easing.circle)
            });
            callButtonRotation.value = withDelay(250,
                withTiming(0, {
                    duration: 250,
                    easing: Easing.out(Easing.circle)
                })
            );
        }
    }, [dialButtons]);

    const callButtonRotationStyle = useAnimatedStyle(() => ({
        transform: [{ rotateX: `${callButtonRotation.value}deg` }]
    }));
    
    const dialButtonRotationStyle = useAnimatedStyle(() => ({
        transform: [{ rotateX: `${dialButtonRotation.value}deg` }]
    }));

    return(
        <View style={{
            backgroundColor: Colors[theme].foreground,
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
                }}>
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        width: "100%",
                        height: "100%"
                    }}>
                        <View style={{
                            flex: 3
                        }}/>
                        <View
                            style={{
                                flex: 1,
                                gap: BUTTON_GAP,
                            }}
                        >
                            <View style={{
                                flexDirection: "row",
                                gap: BUTTON_GAP,
                                flex: 1
                            }}>
                                <CallScreenButton text="speaker" icon="volume-up" style={callButtonRotationStyle}/>
                                <CallScreenButton text="mute" icon="mic" style={callButtonRotationStyle}/>
                                <CallScreenButton text="add call" icon="person-add" style={callButtonRotationStyle}/>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                gap: BUTTON_GAP,
                                flex: 1
                            }}>
                                <CallScreenButton text="hold" icon="pause" style={callButtonRotationStyle}/>
                                <CallScreenButton text="video call" icon="video-call" style={callButtonRotationStyle}/>
                                <CallScreenButton text="message" icon="message" style={callButtonRotationStyle}/>
                            </View>
                        </View>
                    </View>
                    <View style={{
                        position: 'absolute',
                        bottom: 0,
                        width: "100%",
                        height: "100%"
                    }}>
                        <View style={{
                            flex: 2
                        }}/>
                        <View
                            style={{
                                flex: 2,
                                gap: BUTTON_GAP,
                            }}
                        >
                            <View style={{
                                flexDirection: "row",
                                gap: BUTTON_GAP,
                                flex: 1
                            }}>
                                <DialButton text="1" subtext={t("b1Label")} tone={NativeDTMF.getConstants().TONE_DTMF_1} onPress={() => setDialedNumber(dialedNumber + "1")} style={dialButtonRotationStyle}/>
                                <DialButton text="2" subtext={t("b2Label")} tone={NativeDTMF.getConstants().TONE_DTMF_2} onPress={() => setDialedNumber(dialedNumber + "2")} style={dialButtonRotationStyle}/>
                                <DialButton text="3" subtext={t("b3Label")} tone={NativeDTMF.getConstants().TONE_DTMF_3} onPress={() => setDialedNumber(dialedNumber + "3")} style={dialButtonRotationStyle}/>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                gap: BUTTON_GAP,
                                flex: 1
                            }}>
                                <DialButton text="4" subtext={t("b4Label")} tone={NativeDTMF.getConstants().TONE_DTMF_4} onPress={() => setDialedNumber(dialedNumber + "4")} style={dialButtonRotationStyle}/>
                                <DialButton text="5" subtext={t("b5Label")} tone={NativeDTMF.getConstants().TONE_DTMF_5} onPress={() => setDialedNumber(dialedNumber + "5")} style={dialButtonRotationStyle}/>
                                <DialButton text="6" subtext={t("b6Label")} tone={NativeDTMF.getConstants().TONE_DTMF_6} onPress={() => setDialedNumber(dialedNumber + "6")} style={dialButtonRotationStyle}/>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                gap: BUTTON_GAP,
                                flex: 1
                            }}>
                                <DialButton text="7" subtext={t("b7Label")} tone={NativeDTMF.getConstants().TONE_DTMF_7} onPress={() => setDialedNumber(dialedNumber + "7")} style={dialButtonRotationStyle}/>
                                <DialButton text="8" subtext={t("b8Label")} tone={NativeDTMF.getConstants().TONE_DTMF_8} onPress={() => setDialedNumber(dialedNumber + "8")} style={dialButtonRotationStyle}/>
                                <DialButton text="9" subtext={t("b9Label")} tone={NativeDTMF.getConstants().TONE_DTMF_9} onPress={() => setDialedNumber(dialedNumber + "9")} style={dialButtonRotationStyle}/>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                gap: BUTTON_GAP,
                                flex: 1
                            }}>
                                <DialStarButton onPress={() => setDialedNumber(dialedNumber + "*")} style={dialButtonRotationStyle}/>
                                <DialButton text="0" subtext="+" tone={0.1 /* Kotlin weirdness */} onPress={() => setDialedNumber(dialedNumber + "0")} onLongPress={() => setDialedNumber(dialedNumber + "+")} style={dialButtonRotationStyle}/>
                                <DialPoundButton onPress={() => setDialedNumber(dialedNumber + "#")} style={dialButtonRotationStyle}/>
                            </View>
                        </View>
                    </View>
                </View>
                <View 
                    style={{
                        flexDirection: "row",
                        gap: BUTTON_GAP,
                        flex: 0.125,
                        marginTop: BUTTON_GAP
                    }}
                >
                    <CallScreenEndButton text="end call" onPress={() => {}}/>
                    <CallScreenButton icon="dialpad" onPress={() => {setDialButtons(!dialButtons)}}/>
                </View>
            </SafeAreaView>
        </View>
    );
}

export default CallScreen;