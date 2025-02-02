import { useContext } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../style/colors";
import FontStyles from "../style/fonts";
import { AnimatedStyle, useSharedValue} from "react-native-reanimated";
import MetroTouchable from "./MetroTouchable";
import { StyleProp, Text, ViewStyle } from "react-native";

type Attributes = {
    text: string,
    children?: React.ReactElement<any, any>
    onPress?: () => void,
    style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>,
    disabled?: boolean
}

function Button({
    text = "",
    onPress = () => {},
    children,
    style,
    disabled = false
}: Attributes): React.JSX.Element {
    const backgroundColor = useSharedValue("#00000000");

    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    function onPressIn(): void {
        backgroundColor.value = Colors.accentColor
    }

    function onPressOut(): void {
        backgroundColor.value = "#00000000";
    }

    return(
        <MetroTouchable
            disabled={disabled}
            style={[{
                borderColor: disabled? Colors[theme].secondary: Colors[theme].primary,
                borderWidth: 3,
                //paddingVertical: 6,
                marginEnd: "auto",
                backgroundColor: backgroundColor,
                marginVertical: 10
            }, style]}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onPress}
        >
            {children || <></>}
            <Text style={[{
                color: disabled? Colors[theme].secondary: Colors[theme].primary,
                marginHorizontal: 10,
                marginVertical: 6
            }, FontStyles.box]}>
                {text}
            </Text>
        </MetroTouchable>
    )
}

export function ModalButton({
    text = "",
    onPress = () => {},
    children,
    style,
    disabled = false
}: Attributes): React.JSX.Element {
    const backgroundColor = useSharedValue("#00000000");

    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    function onPressIn(): void {
        backgroundColor.value = Colors.accentColor
    }

    function onPressOut(): void {
        backgroundColor.value = "#00000000";
    }

    return(
        <MetroTouchable
            disabled={disabled}
            style={[{
                borderColor: disabled? Colors[theme].secondary: Colors[theme].primary,
                borderWidth: 3,
                //paddingVertical: 6,
                backgroundColor: backgroundColor,
                marginTop: 10,
                paddingLeft: "auto",
                flex: 1,
                height: "auto"
            }, style]}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={onPress}
            ignoreStatusBarHeight={false}
        >
            {children || <></>}
            <Text style={[{
                color: disabled? Colors[theme].secondary: Colors[theme].primary,
                marginHorizontal: "auto",
                marginVertical: 6
            }, FontStyles.info]}>
                {text}
            </Text>
        </MetroTouchable>
    )
}

export default Button