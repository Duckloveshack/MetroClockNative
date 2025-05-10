import { useContext, useEffect, useState } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../style/colors";
import FontStyles from "../style/fonts";
import Animated, { AnimatedStyle, Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import { StyleProp, ViewStyle, TextInput, DimensionValue } from "react-native";

type Attributes = {
    onChangeText?: (text: string) => void,
    style?: StyleProp<ViewStyle>,
    disabled?: boolean,
    shiftDown?: boolean
}

function TextBox({
    onChangeText = (text: string) => {},
    style,
    disabled = false,
    shiftDown = false
}: Attributes): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);
    const [onFocus, setOnFocus] = useState<boolean>(false);

    //not really how it works in wp8 but i just wanted to test something out
    const topMargin = useSharedValue<DimensionValue>('0%');

    useEffect(() => {
        if (shiftDown) {
            if (onFocus) {
                topMargin.value = withTiming("100%", {
                    duration: 200,
                    easing: Easing.out(Easing.circle)
                });
            } else {
                topMargin.value = withTiming("0%", {
                    duration: 200,
                    easing: Easing.out(Easing.circle)
                });
            }
        }
    }, [onFocus]);

    const viewStyle = useAnimatedStyle(() => ({
        marginTop: topMargin.value
    }))

    return(
        <Animated.View style={[{ flexDirection: "row" }, viewStyle]}>
            <TextInput
                style={[{
                    backgroundColor: disabled? Colors[theme].secondary: Colors[theme].primary,
                    color: Colors[theme].background,
                    borderColor: onFocus? Colors.accentColor: Colors[theme].primary,
                    borderWidth: 3,
                    marginEnd: "auto",
                    marginVertical: 10,
                    paddingVertical: 6,
                    flex: 1
                }, FontStyles.box, style]}
                editable={!disabled}
                onChangeText={onChangeText}
                cursorColor={Colors.accentColor}
                selectionColor={Colors.accentColor}
                onFocus={() => { setOnFocus(true); }}
                onBlur={() => { setOnFocus(false); }}
            />
        </Animated.View>
    )
}

export default TextBox