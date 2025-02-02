import { Text, View } from "react-native"
import { useContext, useEffect } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../style/colors";
import FontStyles from "../style/fonts";
import SimContext, { SimContextProps } from "../../context/SimContext";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import MetroTouchable from "./MetroTouchable";

function SIMSwitch(): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);
    const { sims, currentSim, setSimIndex, simColors } = useContext<SimContextProps>(SimContext);
    const pickerLeft = useSharedValue(0);

    useEffect(() => {
        pickerLeft.value = withTiming(40*currentSim, {
            duration: 200,
            easing: Easing.out(Easing.circle)
        })
    }, [currentSim]);

    const pickerStyle = useAnimatedStyle(() => ({
        left: pickerLeft.value,
    }))

    return(
        <MetroTouchable>
        <View style={{
            height: 30,
            width: 40*sims.length
        }}>
            <View style={{ 
                flexDirection: "row",
                position: "absolute"
            }}>
                {sims.map((sim, index) => (
                    <View key={index} style={{
                        height: 30,
                        width: 40,
                        borderWidth: 3,
                        borderColor: Colors[theme].foreground,
                        borderRightWidth: index == sims.length-1? 3: 0
                    }}/>
                ))}
            </View>
            <Animated.View style={[{
                borderColor: Colors[theme].background,
                borderWidth: 4,
                position: "absolute",
                transform: [{
                    translateY: -4
                }, {
                    translateX: -4
                }]
            }, pickerStyle]}>
                <View style={{
                    height: 30,
                    width: 40,
                    backgroundColor: simColors[currentSim] || Colors.accentColor,
                }}/>
            </Animated.View>
            <View style={{ 
                flexDirection: "row",
                position: "absolute"
            }}>
                {sims.map((sim, index) => (
                    <TouchableWithoutFeedback
                        onPress={() => {
                            setSimIndex(index)
                        }}
                        key={index}
                    >
                        <Text style={[{
                            height: 30,
                            width: 40,
                            color: index == currentSim? Colors[theme].primary: Colors[theme].secondary,
                            textAlign: "center",
                            verticalAlign: "middle"
                        }, FontStyles.switch]}>
                            {index+1}
                        </Text>
                    </TouchableWithoutFeedback>
                ))}
            </View>
        </View>
        </MetroTouchable>
    )
}

export default SIMSwitch