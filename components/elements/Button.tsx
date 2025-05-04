import { useContext, useEffect } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../style/colors";
import FontStyles from "../style/fonts";
import { AnimatedStyle, useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import MetroTouchable, { MetroActionView } from "./MetroTouchable";
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

    const backgroundColorStyle = useAnimatedStyle(() => ({
        backgroundColor: backgroundColor.value
    }))

    return(
        <MetroActionView
            style={[{
                borderColor: disabled? Colors[theme].secondary: Colors[theme].primary,
                borderWidth: 3,
                marginEnd: "auto",
                marginVertical: 10,
                
            }, backgroundColorStyle, style]}
            onTap={onPress}
            onTapStart={onPressIn}
            onTapEnd={onPressOut}
            enabled={!disabled}
        >
            {children || <></>}
            <Text style={[{
                color: disabled? Colors[theme].secondary: Colors[theme].primary,
                marginHorizontal: 10,
                marginVertical: "auto",
                textAlign: "center",             
            }, FontStyles.box]}>
                {text}
            </Text>
        </MetroActionView>
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

    return(
        // <MetroTouchable
        //     disabled={disabled}
        //     style={[{
        //         borderColor: disabled? Colors[theme].secondary: Colors[theme].primary,
        //         borderWidth: 3,
        //         //paddingVertical: 6,
        //         backgroundColor: backgroundColor,
        //         marginTop: 10,
        //         paddingLeft: "auto",
        //         flex: 1,
        //         height: "auto"
        //     }, style]}
        //     onPressIn={onPressIn}
        //     onPressOut={onPressOut}
        //     onPress={onPress}
        //     ignoreStatusBarHeight={false}
        // >
        //     {children || <></>}
        //     <Text style={[{
        //         color: disabled? Colors[theme].secondary: Colors[theme].primary,
        //         marginHorizontal: "auto",
        //         marginVertical: 6
        //     }, FontStyles.info]}>
        //         {text}
        //     </Text>
        // </MetroTouchable>
        <MetroActionView
            style={[{
                borderColor: disabled? Colors[theme].secondary: Colors[theme].primary,
                borderWidth: 3,
                marginEnd: "auto",
                marginTop: 10,
                flex: 1
            }, style]}
            onTap={onPress}
            enabled={!disabled}
        >
            {children || <></>}
            <Text style={[{
                color: disabled? Colors[theme].secondary: Colors[theme].primary,
                marginHorizontal: 10,
                marginVertical: 6,
                textAlign: "center"
            }, FontStyles.box]}>
                {text}
            </Text>
        </MetroActionView>
    )
}

type CallButtonAttributes = {
    disabled?: boolean,
    onPress?: () => void,
    onPressIn?: () => void,
    onPressOut?: () => void,
    onLongPress?: () => void
    children: React.ReactNode,
    style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>,
}

export function CallButton({
    disabled = false,

    onPress = () => {},
    onLongPress = () => {},
    onPressIn = () => {},
    onPressOut = () => {},

    children,
    style,
}: CallButtonAttributes): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    const buttonColor = useSharedValue(Colors[theme].middleground);

    useEffect(() => {
        buttonColor.value = Colors[theme].middleground;
    }, [theme])

    return (
        <MetroActionView
            style={[{
                flex: 1,
                backgroundColor: !disabled? buttonColor: Colors[theme].middleground
            }, style]}
            onTap={onPress}
            onTapStart={() => { buttonColor.value = Colors.accentColor; onPressIn(); }}
            onTapEnd={() => { buttonColor.value = Colors[theme].middleground; onPressOut(); }}
            onHold={onLongPress}
            transformations={[ "position", "scale", "rotation"]}
            enabled={!disabled}
        >
            {children}
        </MetroActionView>
    )
}

export default Button