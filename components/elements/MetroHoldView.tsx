import { View, ViewProps } from "react-native"
import { Pressable } from "react-native-gesture-handler"
import Animated, { AnimatedProps, Easing, useSharedValue, withTiming } from "react-native-reanimated"
import Colors from "../style/colors"
import { useContext, useRef, useState } from "react"
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import { PressableEvent } from "react-native-gesture-handler/lib/typescript/components/Pressable/PressableProps"

const HOLD_DOWN_DELAY = 250;
const HOLD_DOWN_TIME = 300;

type HoldOption = {
    name: string,
    onPress: () => void
}

type Attributes = {
    children?: React.ReactNode
    options?: HoldOption[]
}

function MetroHoldView({
    children,
    options = [],
    ...props
}: Attributes & ViewProps): React.JSX.Element {
    const [expanded, setExpanded] = useState<boolean>(false);

    const viewWidth = useSharedValue<`${number}%`>("0%");
    const viewHeight = useSharedValue<number>(0);
    const viewTranslation = useSharedValue<number>(0);
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    const pressInTimeout = useRef<NodeJS.Timeout>(null);

    function onPressIn(event: PressableEvent) {
        viewTranslation.value = event.nativeEvent.pageX;

        pressInTimeout.current = setTimeout(() => {

            viewHeight.value = 2;
            viewWidth.value = withTiming("100%", {
                duration: HOLD_DOWN_TIME,
                easing: Easing.out(Easing.circle)
            });
            viewTranslation.value = withTiming(0, {
                duration: HOLD_DOWN_TIME,
                easing: Easing.out(Easing.circle)
            });

        }, HOLD_DOWN_DELAY)
    }

    function onPressOut() {
        if (pressInTimeout.current) clearTimeout(pressInTimeout.current);
        viewHeight.value = 0;
        viewWidth.value = "0%";
    }

    return (
        <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={{
                position: "relative"
            }}
        >
            <View {...props}>
                {children}
            </View>
            <Animated.View
                style={{
                    position: "absolute",
                    width: viewWidth,
                    height: viewHeight,
                    backgroundColor: Colors[theme].primary,
                    transform: [{ translateX: viewTranslation }]
                }}
            >

            </Animated.View>
        </Pressable>
    )
}

export default MetroHoldView