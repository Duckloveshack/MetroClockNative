import { DB, moveAssetsDatabase, open } from "@op-engineering/op-sqlite";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, FlatList, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { transliterate } from "transliteration";
import MetroTouchable, { MetroActionView } from "../components/elements/MetroTouchable";
import TextBox from "../components/elements/TextBox";
import Colors from "../components/style/colors";
import FontStyles from "../components/style/fonts";
import ThemeContext, { ThemeContextProps } from "../context/ThemeContext";
import { CityPickScreenProps } from "../types/screens";
import ClocksContext, { ClocksContextProps } from "../context/ClocksContext";
import SectionTitle from "../components/elements/SectionTitle";
import { Pressable } from "react-native-gesture-handler";

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

function CityPickScreen({
    navigation
}: CityPickScreenProps): React.JSX.Element {
    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);
    const { addClock } = useContext<ClocksContextProps>(ClocksContext);
    const { t } = useTranslation(["common", "clocks"]);
    const [cityList, setCityList] = useState<Array<any>>([]);

    function renderItem({item, index}: {item: City, index: number}) {
        function onTap() {
            addClock({
                name: item.name,
                timezone: item.timezone
            });
            if (navigation.canGoBack()) navigation.goBack();
        }

        return (
            <Pressable
                style={{
                    height: 45,
                    backgroundColor: Colors[theme].primary,
                    marginTop: -1 //trying to fix a rendering issue
                }}
                onPress={onTap}
                key={index}
            >
                <MetroActionView
                    style={{
                        marginEnd: "auto",
                        paddingHorizontal: 5,
                        paddingVertical: 7,
                        paddingTop: 8
                    }}
                    onTap={onTap}
                >
                    <Text numberOfLines={1} style={[{
                        color: Colors[theme].background,
                        verticalAlign: "middle"
                    }, FontStyles.box]}
                    >
                        {item.name}
                    </Text>
                </MetroActionView>
            </Pressable>
        )
    }

    async function onChangeText(text: string) {
        if (text == "") {
            setCityList([])
        } else { 
            const statement = cityDB.prepareStatement("SELECT * FROM cities WHERE UPPER(ascii_name) LIKE ? ORDER BY population DESC");
            await statement?.bind([`${transliterate(text.toUpperCase())}%`]);
            const citiesElement = await statement.execute()

            setCityList(citiesElement.rows);
        }
    }

    return(
        <View style={{
            backgroundColor: Colors[theme].background,
        }}>
            <StatusBar
                barStyle={isDark? "light-content": "dark-content"}
                backgroundColor={"#ffffff00"}
                translucent={true}
            />
            <SafeAreaView style={{
                height: "100%",
                width: "100%",
            }}>
                <View style={{
                    width: "100%",
                    height: "100%",
                    padding: 10
                }}>
                    <View style={{margin: 5, marginBottom: 0}}>
                        {/* i like genuinely have no idea why vscode is acting up about the 'never' return value */}
                        <SectionTitle title={(t("clocks:title.pickCity") as string).toUpperCase()}/>
                    </View>
                    <TextBox
                        onChangeText={onChangeText}
                    />
                    <FlatList
                        data={cityList}
                        renderItem={renderItem}
                    />
                </View>
            </SafeAreaView>          
        </View>
    );
}

export default CityPickScreen;