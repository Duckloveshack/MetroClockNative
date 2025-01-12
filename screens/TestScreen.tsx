import React, { useContext } from "react";
import { View, Text, StyleSheet, StatusBar, NativeModules } from "react-native";
import ThemeContext, { ThemeContextProps } from "../context/ThemeContext";
import Colors from "../components/style/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import TitleText from "../components/elements/TitleText";
import SectionTitle from "../components/elements/SectionTitle";
import SimContext, { SimContextProps } from "../context/SimContext";
import FontStyles from "../components/style/fonts";

const { MiscBridgeModule } = NativeModules;

type Attributes = {
    navigation: any
}

function TestScreen({
    navigation
}: Attributes): React.JSX.Element {
    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);
    const sims = useContext<SimContextProps>(SimContext);

    console.log(sims);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: Colors[theme].background,
            padding: 15,
            flex: 1
        },
        descriptionText: {
            color: Colors[theme].textPrimary,
        },
        accentDescriptionText: {
            color: MiscBridgeModule.getAccentColor()
        }
    });

    return(
        <View style={styles.container}>
            <StatusBar
                barStyle={isDark? "light-content": "dark-content"}
                backgroundColor={"#ffffff00"}
                translucent={true}
            />
            <SafeAreaView>
                <SectionTitle title="METRO DIALER" subtitle="optional subtitle"/>
                <TitleText text="test screen thingy"/>
                <View>
                    <Text style={[FontStyles.info, styles.descriptionText]}>
                        Yes that is a stylistic choice ^ {"\n\n"}
                        This is some test text {"\n"}
                        Testing out the possibility of having <Text style={styles.accentDescriptionText}>an accent color</Text> (let's hope it works)
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    );
}

export default TestScreen;