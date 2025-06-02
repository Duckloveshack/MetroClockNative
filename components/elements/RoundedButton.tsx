import { useContext, useRef } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../style/colors";
import Icon from "@react-native-vector-icons/material-icons";
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
    const buttonBackground = useSharedValue("#00000000");

    return(
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