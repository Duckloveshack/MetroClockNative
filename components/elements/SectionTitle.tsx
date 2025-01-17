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
            {subtitle && (
                <Text style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: Colors[theme].secondary
                }}>
                    {subtitle}
                </Text>
            )}
        </View>
    )
}

export default SectionTitle