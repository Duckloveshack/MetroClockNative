import React, { useContext, useRef, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext";
import Colors from "../../components/style/colors";
import FontStyles from "../../components/style/fonts";
import LocalizationContext, { LocalizationContextProps } from "../../context/LocalizationContext";
import BottomBarContext, { BottomBarContextProps, BottomBarProvider } from "../../context/BottomBarContext";
import { ScreenletAttributes } from "../../components/elements/MetroTabs";
import Animated, { runOnJS, useAnimatedReaction, useSharedValue, withDelay, withTiming, Easing, useAnimatedStyle } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import Button from "../../components/elements/Button";
import BackgroundTimer from "@boterop/react-native-background-timer";

function StopwatchScreen({
    index,
    currentIndex,
    route,
    navigation
}: ScreenletAttributes): React.JSX.Element {
    const { theme, isDark } = useContext<ThemeContextProps>(ThemeContext);
    const { locale, setLocale } = useContext<LocalizationContextProps>(LocalizationContext);
    const { setBar } = useContext<BottomBarContextProps>(BottomBarContext);
    const { t } = useTranslation(["common", "settings"]);

    const [running, setRunning] = useState<boolean>(false);
    const [ellapsedTime, setEllapsedTime] = useState<number>(0);
    const [laps, setLaps] = useState<Array<number>>([]);

    const mainRotation = useSharedValue<number>(0);
    const secondaryRotation = useSharedValue<number>(-90);

    const actualTime = useRef<number>(0);

    const intervalRef = useRef<number>();

    function stopwatchBar() {
        setBar({
            controls: [],
            options: [],
            hidden: true
        });
    }

    useAnimatedReaction(
        () => currentIndex?.value,
        (curIndex, prevIndex) => {
            if (curIndex == index && curIndex != prevIndex) {
                runOnJS(stopwatchBar)()
            }
        },
        [setBar, t]
    )

    function runInterval() {
        if (intervalRef.current) BackgroundTimer.clearInterval(intervalRef.current);
        intervalRef.current = BackgroundTimer.setInterval(() => {
            setEllapsedTime(actualTime.current+1000/60)
            actualTime.current = actualTime.current + 1000/60
        }, 1000/60);
    }

    function startTimer() {
        //just in case
        setRunning(true)
        runInterval()
    }

    function pauseTimer() {
        if (intervalRef.current) BackgroundTimer.clearInterval(intervalRef.current);

        secondaryRotation.value = 90;
        mainRotation.value = withTiming(-90, {
            duration: 250,
            easing: Easing.in(Easing.circle)
        });
        secondaryRotation.value = withDelay(250, 
            withTiming(0, {
                duration: 250,
                easing: Easing.out(Easing.circle)
            })
        );
    }

    function resumeTimer() {
        runInterval()

        mainRotation.value = 90;
        secondaryRotation.value = withTiming(-90, {
            duration: 250,
            easing: Easing.in(Easing.circle)
        });
        mainRotation.value = withDelay(250, 
            withTiming(0, {
                duration: 250,
                easing: Easing.out(Easing.circle)
            })
        );
    }

    function clearTimer() {
        setEllapsedTime(0);
        setRunning(false);
        setLaps([]);

        mainRotation.value = 90;
        secondaryRotation.value = withTiming(-90, {
            duration: 250,
            easing: Easing.in(Easing.circle)
        });
        mainRotation.value = withDelay(250, 
            withTiming(0, {
                duration: 250,
                easing: Easing.out(Easing.circle)
            })
        );
    }

    function createLap() {
        setLaps((laps) => {
            return [ellapsedTime].concat(laps);
        })
    }

    const mainRotationStyle = useAnimatedStyle(() => ({ transform: [{ rotateX: `${mainRotation.value}deg` }] }));
    const secondaryRotationStyle = useAnimatedStyle(() => ({ transform: [{ rotateX: `${secondaryRotation.value}deg` }] }));

    return(
        <View style={{
            backgroundColor: Colors[theme].background,
            height: "100%",
            width: "100%",
        }}>
            <View style={{
                marginHorizontal: "auto",
                marginTop: 50,
                marginBottom: 50
            }}>
                <Text style={[{
                    color: Colors[theme].primary,
                }, FontStyles.title]}>
                    <Text>{String(Math.floor(ellapsedTime/3600000)).padStart(2, '0')}</Text>
                    :
                    <Text>{String(Math.floor(ellapsedTime/60000)%60).padStart(2, '0')}</Text>
                    :
                    <Text>{String(Math.floor(ellapsedTime/1000)%60).padStart(2, '0')}</Text>
                    .
                    <Text style={FontStyles.objectTitle}>
                        {String(Math.floor(ellapsedTime%1000)).padStart(3, '0')}
                    </Text>
                </Text>
            </View>
            <ScrollView style={{
                marginBottom: 50
            }}>
                {(laps.map((lapTime, index) => (
                    <View
                        key={index}
                        style={{ alignItems: "center" }}
                    >
                        <Text style={[{
                            color: Colors[theme].primary
                         }, FontStyles.link]}>
                            <Text>{laps.length-index}</Text>
                            <View style={{ width: 20 }}/>
                            <Text>{String(Math.floor(lapTime/3600000)).padStart(2, '0')}</Text>
                            :
                            <Text>{String(Math.floor(lapTime/60000)%60).padStart(2, '0')}</Text>
                            :
                            <Text>{String(Math.floor(lapTime/1000)%60).padStart(2, '0')}</Text>
                            .
                            <Text style={FontStyles.info}>
                                {String(Math.floor(lapTime%1000)).padStart(3, '0')}
                            </Text>
                         </Text>
                    </View>
                )))}
            </ScrollView>
            <View style={{
                marginTop: "auto",
                paddingHorizontal: 10,
                height: 70,
                flexDirection: "row"
            }}>
                <View style={{ flex: 1 }}>
                    <Animated.View style={[{
                        gap: 10,
                        flexDirection: "row",
                        position: "absolute",
                        flex: 1
                    }, mainRotationStyle]}>
                        <Button
                            text="lap"
                            style={{
                                flex: 1,
                                height: 60
                            }}
                            disabled={!running}
                            onPress={createLap}
                        />
                        {!running? <>
                            <Button
                                text="start"
                                style={{
                                    flex: 1,
                                    height: 60
                                }}
                                onPress={startTimer}
                            />
                        </>: <>
                            <Button
                                text="pause"
                                style={{
                                    flex: 1,
                                    height: 60
                                }}
                                onPress={pauseTimer}
                            />
                        </>}
                    </Animated.View>
                    <Animated.View style={[{
                        gap: 10,
                        flexDirection: "row",
                        position: "absolute",
                        flex: 1
                    }, secondaryRotationStyle]}>
                        <Button
                            text="clear"
                            style={{
                                flex: 1,
                                height: 60
                            }}
                            onPress={clearTimer}
                        />
                        <Button
                            text="resume"
                            style={{
                                flex: 1,
                                height: 60
                            }}
                            onPress={resumeTimer}
                        />
                    </Animated.View>           
                </View>
            </View>
        </View>
    );
}

export default StopwatchScreen;