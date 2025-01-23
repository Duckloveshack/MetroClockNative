import { Text, View } from "react-native"
import { useContext } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../style/colors";
import FontStyles from "../style/fonts";

type Attributes = {
    title: string,
    subtitle?: string | React.ReactNode
}

function SectionTitle({
    title,
    subtitle
}: Attributes): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    return(
        <View>
            <Text
                numberOfLines={1}
                style={[FontStyles.sectionTitle, {
                    color: Colors[theme].primary,
                    overflow: "hidden",
                    width: "200%"
                }]}
            >
                {title}
            </Text>
            {typeof subtitle !== "function"? (
                <Text style={[{
                    color: Colors[theme].secondary,
                    marginBottom: -15
                }, FontStyles.sectionSubtitle]}>
                    {subtitle}
                </Text>
            ): subtitle}
        </View>
    )
}

export default SectionTitle