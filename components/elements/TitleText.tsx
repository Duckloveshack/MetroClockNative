import { Text } from "react-native"
import { useContext } from "react";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../style/colors";
import FontStyles from "../style/fonts";

type Attributes = {
    text: string
}

function TitleText({
    text
}: Attributes): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    return(
        <Text
            numberOfLines={1}

            style={[FontStyles.title, {
                marginBottom: 5,
                color: Colors[theme].textPrimary,
                overflow: "hidden",
                width: "200%"
            }]}
        >
            {text}
        </Text>
    )
}

export default TitleText