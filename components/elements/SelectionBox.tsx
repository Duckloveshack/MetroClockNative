import { useContext, useEffect, useState } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../style/colors";
import FontStyles from "../style/fonts";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import MetroTouchable from "./MetroTouchable";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const NORMAL_BOX_HEIGHT = 45;

type Attributes = {
    options: Array<{
        name?: string,
        value: string,
        disabled?: boolean
    }>,
    onChange?: (value: any) => void,
    defaultValue?: string,
    disabled?: boolean
}

function SelectionBox({
    options = [],
    onChange = (value:string) => {},
    defaultValue,
    disabled=false
}: Attributes): React.JSX.Element {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [selected, setSelected] = useState<string>(defaultValue || options[0]?.value || "");

    const boxHeight = useSharedValue(NORMAL_BOX_HEIGHT);
    const optionHeight = useSharedValue(0);
    const selectedHeight = useSharedValue(NORMAL_BOX_HEIGHT-6);
    const zIndex = useSharedValue(0);

    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    const boxStyle = useAnimatedStyle(() => ({
        height: boxHeight.value,
        borderWidth: 3,
        backgroundColor: expanded? Colors[theme].primary: Colors[theme].background,
        borderColor: disabled? Colors[theme].secondary: expanded? Colors.accentColor: Colors[theme].primary,
        paddingTop: expanded? 4: 0,
    }));

    useEffect(() => {
        if (expanded) {
            zIndex.value = 10;
            boxHeight.value = withTiming((NORMAL_BOX_HEIGHT+4)*options.length+14, {
                duration: 250,
                easing: Easing.out(Easing.circle)
            });
            optionHeight.value = withTiming(NORMAL_BOX_HEIGHT+4, {
                duration: 250,
                easing: Easing.out(Easing.circle)
            });
            selectedHeight.value = withTiming(NORMAL_BOX_HEIGHT+4, {
                duration: 250,
                easing: Easing.out(Easing.circle)
            });
        } else {
            boxHeight.value = withTiming(NORMAL_BOX_HEIGHT, {
                duration: 250,
                easing: Easing.out(Easing.circle)
            });
            optionHeight.value = withTiming(0, {
                duration: 250,
                easing: Easing.out(Easing.circle)
            });
            selectedHeight.value = withTiming(NORMAL_BOX_HEIGHT-6, {
                duration: 250,
                easing: Easing.out(Easing.circle)
            });
            setTimeout(() => zIndex.value = 0, 250)
        }
    }, [expanded]);

    return(
        <MetroTouchable
            disabled={expanded || disabled}
            style={{
                flex: 1,
                height: NORMAL_BOX_HEIGHT,
                zIndex: zIndex
            }}
        >
            <Animated.View style={boxStyle}>
                {options.map((option, index) => ((
                    <TouchableWithoutFeedback
                        onPress={() => {
                            if (!disabled && (!option.disabled || !expanded)) {
                                setExpanded(!expanded)
                                if (expanded) {
                                    setSelected(option.value);
                                    if (typeof onChange === "function") onChange(option.value);
                                }
                            }
                        }}
                    >
                        <MetroTouchable style={{ marginEnd: "auto", marginStart: 10 }} disabled={!expanded || disabled}>
                            <Animated.Text
                                style={[{
                                    color: disabled || option.disabled? Colors[theme].secondary: expanded? ( selected === option.value? Colors.accentColor: Colors[theme].background ): Colors[theme].primary,
                                    height: selected === option.value? selectedHeight: optionHeight,
                                    verticalAlign: "middle",
                                }, FontStyles.box]}
                            >
                                {option.name}
                            </Animated.Text>
                        </MetroTouchable>
                    </TouchableWithoutFeedback>
                )))}
            </Animated.View>
        </MetroTouchable>
    )
}

export default SelectionBox