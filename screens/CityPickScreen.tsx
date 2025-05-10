import { DB, moveAssetsDatabase, open } from "@op-engineering/op-sqlite";
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { transliterate } from "transliteration";
import { MetroActionView } from "../components/elements/MetroTouchable";
import TextBox from "../components/elements/TextBox";
import Colors from "../components/style/colors";
import FontStyles from "../components/style/fonts";
import ThemeContext, { ThemeContextProps } from "../context/ThemeContext";
import { CityPickScreenProps } from "../types/screens";
import TileTransitionView from "../components/transitions/TileTransitionView";
import ClocksContext, { ClocksContextProps } from "../context/ClocksContext";

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

function CityPickScreen({
    navigation
}: CityPickScreenProps): React.JSX.Element {
    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);
    const { addClock } = useContext<ClocksContextProps>(ClocksContext);
    const { t } = useTranslation(["common", "settings"]);
    const [cityList, setCityList] = useState<Array<any>>(cities);

    //@ts-ignore
    function renderItem({item, index}: {item: City, index: number}) {
        function onTap() {
            addClock({
                name: item.name,
                timezone: item.timezone
            });
            if (navigation.canGoBack()) navigation.goBack();
        }

        return (
            <MetroActionView
                key={index}
                style={{
                    backgroundColor: Colors[theme].foreground,
                    height: 60
                }}
                onTap={onTap}
            >
                <Text numberOfLines={1} style={[{ color: Colors[theme].primary}, FontStyles.link]}>{item.name}</Text>
            </MetroActionView>
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
        <SafeAreaView style={{
            //backgroundColor: Colors[theme].background,
            backgroundColor: Colors[theme].foreground,
            height: "100%",
            width: "100%",
            // padding: 15
        }}>
            <TileTransitionView style={{ backgroundColor: Colors[theme].foreground }}>
                <TextBox
                    onChangeText={onChangeText}
                />
                <FlatList
                    data={cityList}
                    renderItem={renderItem}
                />
            </TileTransitionView>
        </SafeAreaView>
    );
}

export default CityPickScreen;