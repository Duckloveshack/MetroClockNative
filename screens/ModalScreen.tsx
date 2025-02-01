import React, { useContext} from "react";
import { View, Text, StatusBar } from "react-native";
import ThemeContext, { ThemeContextProps } from "../context/ThemeContext";
import Colors from "../components/style/colors";
import { ModalScreenProps } from "../types/screens";
import { useTranslation } from "react-i18next";
import LocalizationContext from "../context/LocalizationContext";
import { ModalButton } from "../components/elements/Button";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import FontStyles from "../components/style/fonts";
import { useFocusEffect } from "@react-navigation/native";

function DefaultOKButton({
    navigation
}: { navigation: any }) {
    const { t } = useTranslation(["common"]);

    return (
        <ModalButton
            text={t("common:ok")}
            onPress={() => { navigation.goBack(null) }}
        />
    )
}

function ModalScreen({
    route,
    navigation
}: ModalScreenProps): React.JSX.Element {
    const modalRotateX = useSharedValue<number>(90);
    const backgroundColor = useSharedValue<string>("#00000000");

    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);

    useFocusEffect(
        React.useCallback(() => {
            modalRotateX.value = withTiming(0, {
                duration: 200,
                easing: Easing.out(Easing.circle)
            });

            backgroundColor.value = withTiming(isDark? "#0000007f": "#ffffff7f", {
                duration: 200,
                easing: Easing.out(Easing.circle)
            })

            return () => {
                modalRotateX.value = withTiming(-90, {
                    duration: 200,
                    easing: Easing.in(Easing.circle)
                });

                backgroundColor.value = withTiming("#00000000", {
                    duration: 200,
                    easing: Easing.in(Easing.circle)
                })
            }
        }, [])
    )

    const rotateStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotateX: `${modalRotateX.value}deg`
            }
        ]
    }));

    return(
        <Animated.View style={{
            width: "100%",
            height: "100%",
            backgroundColor: backgroundColor
            }}>
            <Animated.View style={[{
                width: "100%",
                backgroundColor: Colors[theme].foreground,
                padding: 15,
                paddingTop: StatusBar.currentHeight,
            }, rotateStyle]}>
                <Text style={[{
                    color: Colors[theme].primary,
                    marginBottom: 20,
                    marginTop: 10
                }, FontStyles.modalTitle]}>
                    {route.params.title}
                </Text>
                {route.params.subtitle? <Text style={[{
                    color: Colors[theme].primary,
                    marginBottom: 20
                }, FontStyles.info]}>
                    {route.params.subtitle}
                </Text> : <></>}
                <View style={{
                    gap: 10,
                    flexDirection: "row"
                }}>
                    {route.params.components || <DefaultOKButton navigation={navigation}/>}
                </View>
            </Animated.View>
        </Animated.View>
    );
}

export default ModalScreen;