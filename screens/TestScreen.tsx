import React, { useContext } from "react";
import { View, Text, StyleSheet, StatusBar, NativeModules, ScrollView } from "react-native";
import ThemeContext, { ThemeContextProps } from "../context/ThemeContext";
import Colors from "../components/style/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import TitleText from "../components/elements/TitleText";
import SectionTitle from "../components/elements/SectionTitle";
import SimContext, { SimContextProps } from "../context/SimContext";
import FontStyles from "../components/style/fonts";
import MetroScroll from "../components/elements/MetroScroll";
import BottomBar from "../components/elements/BottomBar";

const { MiscBridgeModule } = NativeModules;

type Attributes = {
    route: any,
    navigation: any
}

function TestScreen({
    route,
    navigation
}: Attributes): React.JSX.Element {
    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);
    const sims = useContext<SimContextProps>(SimContext);

    const styles = StyleSheet.create({
        container: {
            backgroundColor: Colors[theme].background,
            height: "100%",
            width: "100%"
        },
        itemContainer: {
            padding: 15,
            paddingBottom: 0,
            flex: 1
        },
        descriptionText: {
            color: Colors[theme].primary,
        },
        accentDescriptionText: {
            color: MiscBridgeModule.getAccentColor()
        }
    });

    return(
        <View style={styles.container}>
            <View style={styles.itemContainer}>
            <StatusBar
                barStyle={isDark? "light-content": "dark-content"}
                backgroundColor={"#ffffff00"}
                translucent={true}
            />
            <SafeAreaView style={{flex: 1}}>
                <SectionTitle title="METRO DIALER" subtitle="optional subtitle"/>
                <TitleText text="test screen thingy"/>
                <MetroScroll>
                    <Text style={[FontStyles.info, styles.descriptionText]}>
                        Yes that is a stylistic choice ^ {"\n\n"}
                        This is some test text {"\n"}
                        Testing out the possibility of having <Text style={styles.accentDescriptionText}>an accent color</Text> (let's hope it works)
                    </Text>
                    {/* <ScrollView> */}
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 1</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 2</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 3</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 4</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 5</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 6</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 7</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 8</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 9</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 10</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 11</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 12</Text>

                        <Text style={[FontStyles.title, styles.descriptionText]}>test 1</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 2</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 3</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 4</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 5</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 6</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 7</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 8</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 9</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 10</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 11</Text>
                        <Text style={[FontStyles.title, styles.descriptionText]}>test 12</Text>
                    {/* </ScrollView> */}
                </MetroScroll>
                {/* <Text style={[FontStyles.info, styles.descriptionText]}>this should be <Text style={styles.accentDescriptionText}>below</Text> the scrollview</Text> */}
            </SafeAreaView>
            </View>
            <BottomBar controls={[
                {
                    icon: "telephone",
                    string: "test"
                },
                {
                    icon: "telephone",
                    string: "test"
                },
                {
                    icon: "telephone",
                    string: "test",
                    disabled: true
                },
                {
                    icon: "telephone",
                    string: "test test",
                },
            ]} options={[
                {
                    string: "test link",
                },
                {
                    string: "test link",
                },
                {
                    string: "test link",
                }
            ]}/>
        </View>
    );
}

export default TestScreen;