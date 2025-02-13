import { useContext, useRef } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../style/colors";
import Icon from "@react-native-vector-icons/material-icons";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { View, useWindowDimensions } from "react-native";
import { MetroActionView } from "./MetroTouchable";
import glyphMap from "../../node_modules/@react-native-vector-icons/material-icons/glyphmaps/MaterialIcons.json"

type Attributes = {
    size?: number
    icon: keyof typeof glyphMap,
    disabled?: boolean,
    onPress?: () => any
}

function RoundedButton({
    size=40,
    icon,
    disabled=false,
    onPress=() => {}
}: Attributes): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);
    const ref = useRef<View>(null);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const buttonBackground = useSharedValue("#00000000");

    const windowHeight = useWindowDimensions().height;
    const windowWidth = useWindowDimensions().width;

    function onPressIn() {
        if (!disabled) {
            ref.current?.measure((x: number, y: number, width: number, height: number, screenX: number, screenY: number) => {
                translateX.value = withTiming((windowWidth/2-(screenX+width/2))/100, {
                    duration: 10,
                    easing: Easing.out(Easing.circle)
                });
                translateY.value = withTiming((windowHeight/2-(screenY+height/2))/100, {
                    duration: 10,
                    easing: Easing.out(Easing.circle)
                });
                buttonBackground.value = Colors.accentColor;
            })
        }
    }

    function onPressOut() {
        translateX.value = withTiming(0, {
            duration: 50,
            easing: Easing.in(Easing.circle)
        })
        translateY.value = withTiming(0, {
            duration: 50,
            easing: Easing.in(Easing.circle)
        })
        buttonBackground.value = "#00000000";
    }

    const translateStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: translateX.value
            },
            {
                translateY: translateY.value
            }
        ],
        backgroundColor: buttonBackground.value
    }))

    return(
        // <TouchableWithoutFeedback
        //     onPress={() => {
        //         if (!disabled) {
        //             if (typeof onPress == "function" && !disabled) onPress();
        //         }
        //     }}
        //     onPressIn={onPressIn}
        //     onPressOut={onPressOut}
        // >
        //     <View ref={ref}>
        //     <Animated.View
        //         style={[{
        //             borderColor: disabled? Colors[theme].secondary: Colors[theme].primary,
        //             borderWidth: 2,
        //             width: size,
        //             height: size,
        //             borderRadius: size/2,
        //             justifyContent: "center",
        //             alignItems: "center"
        //         }, translateStyle]}
        //     >
        //         {/* @ts-ignore */}
        //         <Icon name={icon} color={disabled? Colors[theme].secondary: Colors[theme].primary} size={size*0.5}/>
        //     </Animated.View>
        //     </View>
        // </TouchableWithoutFeedback>
        <MetroActionView
            style={{
                borderColor: disabled? Colors[theme].secondary: Colors[theme].primary,
                borderWidth: 2,
                width: size,
                height: size,
                borderRadius: size/2,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: buttonBackground
            }}
            transformations={["position"]}
            onTap={() => { if (!disabled) onPress() }}
            onTapStart={() => { if (!disabled) buttonBackground.value = Colors.accentColor}}
            onTapEnd={() => { buttonBackground.value = "#00000000" }}
        >
            <Icon name={icon} color={disabled? Colors[theme].secondary: Colors[theme].primary} size={size*0.5}/>
        </MetroActionView>
    )
}

export default RoundedButton