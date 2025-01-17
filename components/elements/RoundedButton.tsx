import { View } from "react-native"
import { useContext } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../style/colors";
import Icon from "@react-native-vector-icons/foundation";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

type Attributes = {
    size?: number
    icon: string,
    disabled?: boolean,
    onPress?: () => any
}

function RoundedButton({
    size=40,
    icon,
    disabled=false,
    onPress
}: Attributes): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    return(
        <TouchableWithoutFeedback
            onPress={() => {
                if (!disabled) {
                    if (typeof onPress == "function" && !disabled) onPress();
                }
            }}
        >
            <View
                style={{
                    borderColor: disabled? Colors[theme].secondary: Colors[theme].primary,
                    borderWidth: 2,
                    width: size,
                    height: size,
                    borderRadius: size/2,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                {/* @ts-ignore */}
                <Icon name={icon} color={disabled? Colors[theme].secondary: Colors[theme].primary} size={size*0.625}/>
            </View>
        </TouchableWithoutFeedback>
    )
}

export default RoundedButton