import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, FlatList, TextInput } from "react-native";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../../components/style/colors";
import FontStyles from "../../components/style/fonts";
import LocalizationContext, { LocalizationContextProps } from "../../context/LocalizationContext";
import BottomBarContext, { BottomBarContextProps, BottomBarProvider } from "../../context/BottomBarContext";
import { ScreenletAttributes } from "../../components/elements/MetroTabs";
import RoundedButton from "../../components/elements/RoundedButton";
import { useTranslation } from "react-i18next";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { DB, moveAssetsDatabase, open, PreparedStatement, Scalar } from "@op-engineering/op-sqlite";
import { transliterate } from "transliteration";
import TextBox from "../../components/elements/TextBox";
import TileTransitionView from "../../components/transitions/TileTransitionView";

let cities: Record<string, Scalar>[]
let statement: PreparedStatement
let cityDB: DB;

async function openCityDB() {
    console.log("db{")
    const isMoved = await moveAssetsDatabase({ filename: "city-timezones.db", overwrite: true });
    console.log("a")
    if (!isMoved) {
        console.log('oops')
        throw new Error('Could not move city database.')
    }
    console.log("test")
    cityDB = open({ name: "city-timezones.db" });
    // console.log("test");
    const statement = cityDB.prepareStatement("SELECT * FROM cities ORDER BY name");
    const citiesElement = await statement.execute()

    cities = citiesElement.rows
}

openCityDB()

function TestCityChoice({
    index,
    currentIndex,
    route,
    navigation
}: ScreenletAttributes): React.JSX.Element {
    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);
    const { locale, setLocale } = useContext<LocalizationContextProps>(LocalizationContext);
    const { setBar } = useContext<BottomBarContextProps>(BottomBarContext);
    const { t } = useTranslation(["common", "settings"]);
    const [cityList, setCityList] = useState<Array<any>>(cities);

    function clockBar() {
        setBar({
            controls: [
                {
                    icon: "add",
                    string: t("common:button.add"),
                },
            ],
            options: [
                {
                    string: t("settings:settings"),
                    onPress: () => { navigation.navigate("SettingsScreen"); }
                },
            ],
            hidden: false
        });
    }

        useAnimatedReaction(
            () => currentIndex?.value,
            (curIndex, prevIndex) => {
                if (curIndex == index && curIndex != prevIndex) {
                    runOnJS(clockBar)()
                }
            },
            [setBar, t]
        )

        useEffect(() => {
            if (currentIndex?.value == index) {
                clockBar();
            }
        }, [locale])

    //@ts-ignore
    function renderItem({item, index}) {
        return (
            <View key={index}>
                <Text style={{ color: Colors[theme].primary, fontSize: 20}}>{item.name}</Text>
            </View>
        )
    }

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
        <TileTransitionView style={{
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
        </TileTransitionView>
    );
}

export default TestCityChoice;