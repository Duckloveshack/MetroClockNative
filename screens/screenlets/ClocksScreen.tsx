import React, { useContext, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { runOnJS, useAnimatedReaction } from "react-native-reanimated";
import { ScreenletAttributes } from "../../components/elements/MetroTabs";
import Colors from "../../components/style/colors";
import FontStyles from "../../components/style/fonts";
import BottomBarContext, { BottomBarContextProps } from "../../context/BottomBarContext";
import ClocksContext, { ClocksContextProps, WorldClock } from "../../context/ClocksContext";
import LocalizationContext, { LocalizationContextProps } from "../../context/LocalizationContext";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";

type CityItemAttributes = {
    entry: WorldClock,
    index: number,
    date: Date
}

function CityItem({
    entry,
    index,
    date
}: CityItemAttributes): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);
    const { locale, is24H, shortCityNames } = useContext<LocalizationContextProps>(LocalizationContext);
    const { t } = useTranslation(["common"]);
    const { clocks } = useContext<ClocksContextProps>(ClocksContext);

    const timeOffset = useMemo(() => {
        const timezoneDate = date.toLocaleString("en-ca", {
            timeZone: entry.timezone,
            hour12: false,
        }).replace(', ', 'T').concat(`.${date.getMilliseconds().toString().padStart(3, '0')}Z`);
        const timezoneUTC = new Date(timezoneDate);

        const localDate = date.toLocaleString("en-ca", {
            hour12: false,
        }).replace(', ', 'T').concat(`.${date.getMilliseconds().toString().padStart(3, '0')}Z`);
        const localUTC = new Date(localDate);

        const offsetMinutes = Math.round((timezoneUTC.getTime() - localUTC.getTime()) / (60*1000));

        return `${offsetMinutes < 0? '-': '+'}${Math.floor(Math.abs(offsetMinutes) / 60).toString().padStart(2, "0")}:${(Math.abs(offsetMinutes)%60).toString().padStart(2, '0')}`;
    }, []);

    const cityName = useMemo(() => {
        if (!shortCityNames) {
            return entry.name;
        } else {
            const shortCityName = entry.name.split(", ")[0];
            if (clocks.filter((clock) => clock.name.split(", ")[0] == shortCityName).length > 1) {
                return `${entry.name.split(", ")[0]}, ${entry.name.split(", ")[1]}`
            } else {
                return shortCityName
            }
        }
    }, [clocks, shortCityNames])

    return (
        <View style={{ marginHorizontal: 20 }}>
            <Text style={[{
                color: Colors[theme].primary
            }, FontStyles.dialButton]}>
                {date.toLocaleTimeString(locale, {
                    hour12: !is24H,
                    timeZone: entry.timezone,
                    hour: "numeric",
                    minute: "2-digit"
                }).toLowerCase()}
            </Text>
            <Text numberOfLines={1} style={[{
                color: Colors.accentColor,
                marginTop: -3,
            }, FontStyles.info]}>
                {cityName}
            </Text>
            <Text style={[{
                color: Colors[theme].secondary
            }, FontStyles.info]}>
                {t("common:clocks.dateOffsetFormat", {
                    date: date.toLocaleString(locale, { dateStyle: "full", timeZone: entry.timezone }).toLowerCase(),
                    offset: timeOffset
                })}
            </Text>
        </View>
    )
}

function ClocksScreen({
    index,
    currentIndex,
    navigation
}: ScreenletAttributes): React.JSX.Element {
    const { theme } = useContext<ThemeContextProps>(ThemeContext);
    const { locale } = useContext<LocalizationContextProps>(LocalizationContext);
    const { setBar } = useContext<BottomBarContextProps>(BottomBarContext);
    const { t } = useTranslation(["common", "settings"]);
    const { clocks, removeClock } = useContext<ClocksContextProps>(ClocksContext);

    const [date, setDate] = useState<Date>(new Date());

    useEffect(() => {
        const nextMinute = Math.ceil(date.getTime()/(60*1000))*(60*1000) - date.getTime();
        setTimeout(() => {
            setDate(new Date());

            const dateInterval = setInterval(() => {
                setDate(new Date());
            }, 60*1000);

            return () => {
                clearInterval(dateInterval);
            }       
        }, nextMinute); 
    }, []);

    function clockBar() {
        setBar({
            controls: [
                {
                    icon: "add",
                    string: t("common:button.add"),
                    onPress: () => { navigation.navigate("CityPickScreen"); }
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
    }, [locale]);

    function renderItem({item, index}: {item: WorldClock, index: number}) { return <CityItem entry={item} date={date} index={index}/> }

    return(
        <View style={{
            backgroundColor: Colors[theme].background,
            height: "100%",
            width: "100%",
            // padding: 15
        }}> 
            <FlatList
                data={clocks}
                renderItem={renderItem}
            />
        </View>
    );
}

export default ClocksScreen;