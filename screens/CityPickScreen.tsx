import React, { useCallback, useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, FlatList, TextInput, Dimensions } from "react-native";
import ThemeContext, { ThemeContextProps } from "../context/ThemeContext";
import Colors from "../components/style/colors";
import FontStyles from "../components/style/fonts";
import LocalizationContext, { LocalizationContextProps } from "../context/LocalizationContext";
import BottomBarContext, { BottomBarContextProps, BottomBarProvider } from "../context/BottomBarContext";
import { ScreenletAttributes } from "../components/elements/MetroTabs";
import { useTranslation } from "react-i18next";
import Animated, { Easing, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { DB, moveAssetsDatabase, open, PreparedStatement, Scalar } from "@op-engineering/op-sqlite";
import { transliterate } from "transliteration";
import TextBox from "../components/elements/TextBox";
import { CityPickScreenProps } from "../types/screens";
import { useFocusEffect } from "@react-navigation/native";
import { MetroActionView } from "../components/elements/MetroTouchable";
import { SafeAreaView } from "react-native-safe-area-context";

const windowHeight = Dimensions.get('window').height;

type City = {
    geonameid: number,
    name: string,
    ascii_name: string,
    population: number,
    timezone: string
}

let cities: City[]
let cityDB: DB;

async function openCityDB() {
    const isMoved = await moveAssetsDatabase({ filename: "city-timezones.db", overwrite: true });
    if (!isMoved) {
        throw new Error('Could not move city database.');
    }
    cityDB = open({ name: "city-timezones.db" });
    const statement = cityDB.prepareStatement("SELECT * FROM cities ORDER BY name");
    const citiesElement = await statement.execute();

    cities = citiesElement.rows as City[];
}

openCityDB();

type CityItemProps = {
    item: City,
    index: number,
    animIndex: number
}

function CityItem({ item, index, animIndex }: CityItemProps): React.JSX.Element {
    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);

    const elementRotation = useSharedValue<number>(0);

    if (animIndex != -1) {
        useFocusEffect(
            useCallback(() => {
                if (animIndex != -1) {
                    elementRotation.value = 90;
                    elementRotation.value = withDelay(index*10, withTiming(0, {
                        duration: 50,
                        easing: Easing.out(Easing.circle)
                    }))
                }
    
                return () => {
                    elementRotation.value = withDelay(index*10, withTiming(-90, {
                        duration: 50,
                        easing: Easing.out(Easing.circle)
                    }))
                }
            }, [])
        );
    }

    const rotationStyle = useAnimatedStyle(() => ({ transform: [{ rotateX: `${elementRotation.value}deg` }] }));

    return (
        <MetroActionView
            key={index}
            style={[{
                backgroundColor: Colors[theme].foreground,
                height: 60
            }, rotationStyle]}
        >
            <Text numberOfLines={1} style={[{ color: Colors[theme].primary}, FontStyles.link]}>{item.name}</Text>
        </MetroActionView>
    )
}

function CityPickScreen({
    navigation,
    route
}: CityPickScreenProps): React.JSX.Element {
    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);
    const { t } = useTranslation(["common", "settings"]);
    const [cityList, setCityList] = useState<Array<any>>(cities);

    // useFocusEffect(() => {
    //     useCallback(() => {

    //     }, [])
    // });

    const animationScreenNumber = Math.ceil(windowHeight/20);

    //@ts-ignore
    function renderItem({item, index}) { return <CityItem index={index} item={item} animIndex={Math.max(animationScreenNumber-index, -1)}/>}

    async function onChangeText(text: string) {
        if (text == "") {
            setCityList(cities)
        } else { 
            const statement = cityDB.prepareStatement("SELECT * FROM cities WHERE UPPER(ascii_name) LIKE ? ORDER BY population DESC");
            await statement?.bind([`${transliterate(text.toUpperCase())}%`]);
            const citiesElement = await statement.execute()

            setCityList(citiesElement.rows);
        }
    }

    return(
        <SafeAreaView style={{
            backgroundColor: Colors[theme].background,
            height: "100%",
            width: "100%",
            // padding: 15
        }}>
            <TextBox
                onChangeText={onChangeText}
            />
            <FlatList
                data={cityList}
                renderItem={renderItem}
            />
        </SafeAreaView>
    );
}

export default CityPickScreen;