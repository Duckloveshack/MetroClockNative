import { Text, View } from "react-native"
import { useContext, useEffect, useState } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../style/colors";
import RoundedButton from "./RoundedButton";
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, withDelay, runOnJS } from "react-native-reanimated";
import FontStyles from "../style/fonts";
import MetroScroll from "./MetroScroll";
import { toInteger } from "lodash";

const NORMAL_BAR_HEIHGT = 60;
const REVEALED_BAR_HEIGHT = 80;
const EXTENDED_BAR_HEIGHT = 360;

type LinkAttributes = {
    string: string,
    disabled?: boolean
    onPress?: () => any,
    index: number,
    expanded?: boolean
}

function Link ({
    string = "",
    disabled = false,
    onPress = () => {},
    index = 0,
    expanded = false
}):React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);
    const translateY = useSharedValue(0);

    useEffect(() => {
        if (!expanded) {
            translateY.value = 100;
        } else {
            translateY.value = withDelay(index*25, withTiming(0, {
                duration: 300,
                easing: Easing.out(Easing.circle)
            }));
        } 

        // translateY.value = withDelay(index*25, withTiming(expanded? 0: 100, {
        //     duration: 350,
        //     easing: expanded? Easing.out(Easing.circle): Easing.in(Easing.circle)
        // }))
    }, [expanded])

    const translateStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateY: translateY.value
            }
        ],
        opacity: ( 100 - translateY.value ) / 100
    }))

    return (
        <TouchableWithoutFeedback
            onPress={onPress}
        >
            <Animated.Text style={[{
                color: disabled? Colors[theme].secondary: Colors[theme].primary,
                width: "100%",
                paddingHorizontal: 15,
                paddingVertical: 5
            }, FontStyles.link, translateStyle]}>
                {string}
            </Animated.Text>
        </TouchableWithoutFeedback>
    )
}

type controlProps = Array<{
    icon: string,
    string: string,
    disabled?: boolean,
    onPress?: () => any
}>

type optionProps = Array<{
    string: string,
    disabled?: boolean,
    onPress?: () => any
}>

type Attributes = {
    controls?: controlProps
    options?: optionProps
}

function BottomBar ({
    controls = [],
    options = [],
}: Attributes): React.JSX.Element {
    const [expanded, setExpanded] = useState(false);
    const barHeight = useSharedValue(60);
    const descOpacity = useSharedValue(1);

    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    function expandBar() {
        barHeight.value = withTiming(expanded? NORMAL_BAR_HEIHGT: (options.length !== 0? EXTENDED_BAR_HEIGHT: REVEALED_BAR_HEIGHT), {
            duration: options.length !== 0? 400: 300,
            easing: Easing.out(Easing.poly(5))
        });

        descOpacity.value = withTiming(expanded? 0: 1, {
            duration: 100
        })

        setExpanded(!expanded);
    }

    const expandStyle = useAnimatedStyle(() => ({
        transform: [{
            translateY: -barHeight.value+NORMAL_BAR_HEIHGT
        }]
    }));

    const opacityStyle = useAnimatedStyle(() => ({
        opacity: descOpacity.value
    }))

    return (
        <View
            style={{
                height: NORMAL_BAR_HEIHGT
            }}
        >
        <Animated.View
            style={[{
                backgroundColor: Colors[theme].foreground,
                width: "100%",
                height: EXTENDED_BAR_HEIGHT
            }, expandStyle]}
        >
            <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                height: 60
            }}>
                <View style={{ width: "15%" }}/>
                <View style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 60,
                    flexDirection: "row",
                    width: "70%",
                    gap: 30
                }}>
                    {controls.map((control, index) => {
                        return (
                            <RoundedButton size={40} icon={control.icon} disabled={control.disabled} onPress={control.onPress}/>
                        )
                    })}
                </View>
                <View style={{
                    width: "15%",
                    alignItems: "flex-end",
                }}>
                    <TouchableWithoutFeedback
                        onPress={() => {
                            expandBar()
                        }}
                        style={{
                            flex: 1,
                            paddingLeft: 15
                        }}
                    >
                        <View style={{
                            flexDirection: "row",
                            gap: 4,
                            marginRight: 15,
                            marginTop: 10,
                        }}>
                            <View style={{ backgroundColor: Colors[theme].primary, height: 4, width: 4, borderRadius: 2 }}/>
                            <View style={{ backgroundColor: Colors[theme].primary, height: 4, width: 4, borderRadius: 2 }}/>
                            <View style={{ backgroundColor: Colors[theme].primary, height: 4, width: 4, borderRadius: 2 }}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
            <View style={{
                height: 20,
                flexDirection: "row",
                marginBottom: 15
            }}>
                <View style={{ width: "15%" }}/>
                <View 
                    style={{
                        width: "70%",
                        flexDirection: "row",
                        gap: 10,
                        justifyContent: "center"
                    }}
                >
                    {controls.map((control, index) => {
                        return (
                            // <TouchableWithoutFeedback
                            //     onPress={() => {
                            //         if (typeof control.onPress == "function" && !control.disabled) control.onPress();
                            //     }}
                            // >
                                <Animated.Text style={[{
                                    color: control.disabled? Colors[theme].secondary: Colors[theme].primary,
                                    width: 60,
                                    textAlign: "center",
                                    marginTop: -3
                                }, FontStyles.description, opacityStyle]}>
                                    {control.string}
                                </Animated.Text>
                            // </TouchableWithoutFeedback>
                        )
                    })}
                </View>
                <View style={{ width: "15%" }}/>
            </View>
            <ScrollView style={{ marginBottom: 10}}>
                {options.map((option, index) => (
                    <Link index={index} expanded={expanded} string={option.string} disabled={option.disabled} onPress={option.onPress}/>
                ))}
            </ScrollView>
        </Animated.View>
        </View>
    )
}

export default BottomBar;