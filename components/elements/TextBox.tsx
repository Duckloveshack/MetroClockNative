import { useContext, useEffect } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../style/colors";
import FontStyles from "../style/fonts";
import { AnimatedStyle, useAnimatedStyle, useSharedValue} from "react-native-reanimated";
import MetroTouchable, { MetroActionView } from "./MetroTouchable";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type Attributes = {
    onChangeText?: (text: string) => void,
    style?: StyleProp<ViewStyle>,
    disabled?: boolean
}

function TextBox({
    onChangeText = (text: string) => {},
    style,
    disabled = false
}: Attributes): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    return(
        <View style={{ flexDirection: "row" }}>
        <TextInput
            style={[{
                borderColor: disabled? Colors[theme].secondary: Colors[theme].primary,
                borderWidth: 3,
                marginEnd: "auto",
                marginVertical: 10,
                paddingVertical: 6,
                flex: 1
            }, FontStyles.box, style]}
            enabled={!disabled}
            onChangeText={onChangeText}
            cursorColor={Colors.accentColor}
            selectionColor={Colors.accentColor}
        />
        </View>
    )
}

export default TextBox