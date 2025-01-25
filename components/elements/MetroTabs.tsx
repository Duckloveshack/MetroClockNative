import { useContext } from "react"
import { View } from "react-native"
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext"
import Animated from "react-native-reanimated"
import Colors from "../style/colors"
import FontStyles from "../style/fonts"

type Attributes = {
    screens: Array<{
        key: number,
        title: string,
        screen: React.ReactNode
    }>
}

function MetroTabs({
    screens = []
}: Attributes): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    return (
        <View>
            <Animated.View>
                {screens.map((screen, index) => (
                    <Animated.Text
                        style={[{
                            color: Colors[theme].primary
                        }, FontStyles.title]}
                    >
                        {screen.title}
                    </Animated.Text>
                ))}
            </Animated.View>
        </View>
    )
}

export default MetroTabs;