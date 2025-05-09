import { View } from "react-native";
import Animated, { Easing, Extrapolation, interpolate, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Colors from "../style/colors";
import { useContext, useState } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import { Gesture, GestureDetector, Pressable } from "react-native-gesture-handler";

type Attributes = {
    defaultState: boolean,
    disabled?: boolean,
    onChange: (state: boolean) => void
};

function Switch({
    defaultState = false,
    disabled = false,
    onChange = () => {}
}: Attributes): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);
    const [state, setState] = useState<boolean>(defaultState);

    const switchProgress = useSharedValue<number>(state? 1: 0);

    function onPress() {
        if (!state) {
            switchProgress.value = withTiming(1, {
                duration: 200,
                easing: Easing.out(Easing.circle)
            });
        } else {
            switchProgress.value = withTiming(0, {
                duration: 200,
                easing: Easing.out(Easing.circle)
            });
        }

        onChange(!state);
        setState(!state);
    }

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            const progress = e.translationX / 60 + (state? 1: 0);

            switchProgress.value = progress
        })
        .onEnd((e) => {
            switchProgress.value = withTiming(Math.round(switchProgress.value), {
                duration: 200,
                easing: Easing.in(Easing.circle)
            });
            
            onChange(Math.round(switchProgress.value) == 1);
            setState(Math.round(switchProgress.value) == 1);
        })
        .runOnJS(true);
    
    const tapGesture = Gesture.Tap().onEnd(onPress).runOnJS(true);

    const gesture = Gesture.Exclusive(panGesture, tapGesture);

    const progressStyle = useAnimatedStyle(() => ({
        width: interpolate(switchProgress.value,
            [0, 1],
            [0, 58],
            Extrapolation.CLAMP
        )
    }));

    const knobStyle = useAnimatedStyle(() => ({
        transform: [{
            translateX: interpolate(switchProgress.value,
                [0, 1],
                [0, 64],
                Extrapolation.CLAMP
            )
        }]
    }));

    return (
        <View style={{
            position: "relative",
            height: 36,
        }}>
            <View style={{
                position: "absolute"
            }}>
                <Animated.View style={[{
                    backgroundColor: Colors.accentColor,
                    height: 24,
                    marginTop: 6,
                    marginLeft: 6
                }, progressStyle]}/>
                <GestureDetector gesture={gesture}>
                    <Animated.View style={[{
                        position: "absolute",
                        height: 36,
                        width: 24,
                        backgroundColor: disabled? Colors[theme].secondary: Colors[theme].primary,
                        borderLeftWidth: 3,
                        borderRightWidth: 3,
                        borderColor: Colors[theme].background,
                        zIndex: 1
                    }, knobStyle]}>
                    </Animated.View>
                </GestureDetector>
            </View>
            <Pressable onPress={onPress}>
                <View style={{
                    borderColor: disabled? Colors[theme].secondary: Colors[theme].primary,
                    borderWidth: 3,
                    height: 36,
                    width: 84,
                }}/>
            </Pressable>
        </View>
    )
};

export default Switch;