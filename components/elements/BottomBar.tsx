import { Text, View } from "react-native"
import { useContext, useEffect, useState } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../style/colors";
import RoundedButton from "./RoundedButton";
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, withDelay, runOnJS } from "react-native-reanimated";
import FontStyles from "../style/fonts";
import _ from "lodash";
import MetroTouchable from "./MetroTouchable";

const NORMAL_BAR_HEIGHT = 60;
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
}: LinkAttributes):React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);
    const translateY = useSharedValue(0);

    useEffect(() => {
        if (!expanded) {
            translateY.value = withDelay(Math.max((4-index), 0)*25, withTiming(100, {
                duration: 300,
                easing: Easing.out(Easing.circle)
            }));
        } else {
            translateY.value = withDelay(index*25, withTiming(0, {
                duration: 300,
                easing: Easing.out(Easing.circle)
            }));
        } 
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
            <Animated.View style={[{
                width: "100%",
                paddingHorizontal: 15,
                paddingVertical: 5,
            }, translateStyle]}>
                <MetroTouchable
                    style={{
                        marginEnd: "auto",
                    }}
                    disabled={disabled}
                >
                    <Text style={[{
                        color: disabled? Colors[theme].secondary: Colors[theme].primary,
                    }, FontStyles.link]}>
                        {string}
                    </Text>
                </MetroTouchable>
            </Animated.View>
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
    options?: optionProps,
    oldControls?: controlProps
    hidden?: boolean
}

function BottomBar ({
    controls = [],
    options = [],
    oldControls = [],
    hidden = false
}: Attributes): React.JSX.Element {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [_controls, _setControls] = useState<controlProps>([]);
    const barHeight = useSharedValue<number>(60);
    const descOpacity = useSharedValue<number>(1);
    const controlTranslateY = useSharedValue<number>(0);
    const rootTranslateY = useSharedValue<number>(0);

    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    function expandBar() {
        barHeight.value = withTiming(expanded? NORMAL_BAR_HEIGHT: (options.length !== 0? EXTENDED_BAR_HEIGHT: REVEALED_BAR_HEIGHT), {
            duration: options.length !== 0? 400: 300,
            easing: Easing.out(Easing.poly(5))
        });

        descOpacity.value = withTiming(expanded? 0: 1, {
            duration: 100
        })

        setExpanded(!expanded);
    }

    useEffect(() => {
        controlTranslateY.value = withTiming(-NORMAL_BAR_HEIGHT, {
            duration: 150, 
            easing: Easing.in(Easing.circle)
        })
        setTimeout(() => {
            _setControls(controls);
            controlTranslateY.value = NORMAL_BAR_HEIGHT;
            controlTranslateY.value = withTiming(0, {
                duration: 200,
                easing: Easing.in(Easing.elastic(1.2))
            })
        }, 150)
    }, [controls]);

    useEffect(() => {
        rootTranslateY.value = withTiming(hidden? NORMAL_BAR_HEIGHT: 0, {
            duration: 250,
            easing: Easing.out(Easing.circle)
        })
    }, [hidden])

    const controlStyle = useAnimatedStyle(() => ({
        transform: [{
            translateY: controlTranslateY.value
        }],
        opacity: (NORMAL_BAR_HEIGHT-Math.abs(controlTranslateY.value))/NORMAL_BAR_HEIGHT
    }))

    const expandStyle = useAnimatedStyle(() => ({
        transform: [{
            translateY: -barHeight.value+NORMAL_BAR_HEIGHT
        }]
    }));

    const opacityStyle = useAnimatedStyle(() => ({
        opacity: descOpacity.value
    }));

    const rootStyle = useAnimatedStyle(() => ({
        transform: [{
            translateY: rootTranslateY.value
        }],
        height: rootTranslateY.value == NORMAL_BAR_HEIGHT? 0: NORMAL_BAR_HEIGHT
    }));

    return (
        <Animated.View
            style={rootStyle}
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
                height: 60,
                overflow: "hidden"
            }}>
                <View style={{ width: "15%" }}/>
                <Animated.View style={[{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 60,
                    flexDirection: "row",
                    width: "70%",
                    gap: 30
                }, controlStyle]}>
                    {_controls.map((control, index) => {
                        return (
                            <RoundedButton size={40} icon={control.icon} disabled={control.disabled} onPress={control.onPress}/>
                        )
                    })}
                </Animated.View>
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
                    {_controls.map((control, index) => {
                        return (
                            <Animated.Text style={[{
                                color: control.disabled? Colors[theme].secondary: Colors[theme].primary,
                                width: 60,
                                textAlign: "center",
                                marginTop: -3
                            }, FontStyles.description, opacityStyle]}>
                                {control.string}
                            </Animated.Text>
                        )
                    })}
                </View>
                <View style={{ width: "15%" }}/>
            </View>
            <ScrollView style={{ marginBottom: 10 }}>
                {options.map((option, index) => (
                    <Link index={index} expanded={expanded} string={option.string} disabled={option.disabled} onPress={option.onPress} key={index}/>
                ))}
            </ScrollView>
        </Animated.View>
        </Animated.View>
    )
}

export default BottomBar;