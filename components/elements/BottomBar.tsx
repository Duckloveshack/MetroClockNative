import { Text, View } from "react-native"
import { useContext, useState } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../style/colors";
import RoundedButton from "./RoundedButton";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated";
import FontStyles from "../style/fonts";
import MetroScroll from "./MetroScroll";

const NORMAL_BAR_HEIHGT = 60;
const REVEALED_BAR_HEIGHT = 80;
const EXTENDED_BAR_HEIGHT = 360;

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
    const barHeight = useSharedValue(60)

    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    function expandBar() {
        // if (!expanded) {
        //     barHeight.value = withTiming(EXTENDED_BAR_HEIGHT, {
        //         duration: 300,
        //         easing: Easing.out(Easing.bezierFn(0.5, 0, 1, 0))
        //     })
        // } else {
        //     barHeight.value = withTiming(NORMAL_BAR_HEIHGT, {
        //         duration: 300,
        //         easing: Easing.out(Easing.bezierFn(0.5, 0, 1, 0))
        //     })
        // }

        barHeight.value = withTiming(expanded? NORMAL_BAR_HEIHGT: (options.length !== 0? EXTENDED_BAR_HEIGHT: REVEALED_BAR_HEIGHT), {
            duration: options.length !== 0? 300: 200,
            easing: Easing.out(Easing.bezierFn(0.5, 0, 1, 0))
        })

        setExpanded(!expanded)
    }

    const expandStyle = useAnimatedStyle(() => ({
        height: barHeight.value,
        transform: [{
            translateY: -barHeight.value+NORMAL_BAR_HEIHGT
        }]
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
                width: "100%"
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
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    if (typeof control.onPress == "function" && !control.disabled) control.onPress();
                                }}
                            >
                                <Text style={{
                                    color: control.disabled? Colors[theme].secondary: Colors[theme].primary,
                                    fontSize: 12,
                                    width: 60,
                                    textAlign: "center",
                                    marginTop: -3
                                }}>
                                    {control.string}
                                </Text>
                            </TouchableWithoutFeedback>
                        )
                    })}
                </View>
                <View style={{ width: "15%" }}/>
            </View>
            <View style={{
                paddingHorizontal: 20,
                gap: 10
            }}>
                {/* <MetroScroll> */}
                    {options.map((option, index) => {
                        return (
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    if (typeof option.onPress == "function" && !option.disabled) option.onPress();
                                }}
                            >
                                <Text style={[{
                                    color: option.disabled? Colors[theme].secondary: Colors[theme].primary,
                                    width: "100%"
                                }, FontStyles.link]}>
                                    {option.string}
                                </Text>
                            </TouchableWithoutFeedback>
                        )
                    })}
                {/* </MetroScroll> */}
            </View>
        </Animated.View>
        </View>
    )
}

export default BottomBar;