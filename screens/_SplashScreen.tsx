import React, { useContext, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView, Image } from "react-native";
import { SettingsScreenProps, SplashScreenProps } from "../types/screens";
import Icon from "@react-native-vector-icons/foundation";
//import SplashLogo from "../assets/bootsplash-logo.svg";

function SplashScreen({
    route,
    navigation
}: SplashScreenProps): React.JSX.Element {

    useEffect(() => {
        setTimeout(() => {navigation.replace("Test"); }, 100);
    }, [navigation])

    return(
        <View style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#cc1050",
        }}>
            <StatusBar/>
            <Icon name="telephone" size={100} color={"#ffffff"} style={{
                margin: "auto"
            }}/>
        </View>
    );
}

export default SplashScreen;