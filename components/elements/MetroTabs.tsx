import React, { useCallback, useContext, useEffect, useRef, useState } from "react"
import { LayoutChangeEvent, ScrollView, TouchableWithoutFeedback, useWindowDimensions, View } from "react-native"
import ThemeContext, { ThemeContextProps } from "../../context/ThemeContext"
import Animated, { ReanimatedLogLevel, useSharedValue, configureReanimatedLogger, interpolate, useAnimatedRef, runOnJS, interpolateColor, useAnimatedStyle, SharedValue } from "react-native-reanimated"
import Colors from "../style/colors"
import FontStyles from "../style/fonts"
import { NavigationProp, RouteProp } from "@react-navigation/native"
import { RootStackParamList } from "../../types/screens"
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel"
import { FlatList } from "react-native-gesture-handler"

const DISTANCE_BETWEEN_TITLES = 15;

export type ScreenletAttributes = {
    index: number,
    route: RouteProp<RootStackParamList>,
    navigation: NavigationProp<RootStackParamList>
}

type screenType = {
    title: string,
    component: React.ComponentType<ScreenletAttributes>
}

type Attributes = {
    screens: Array<screenType>,
    route: RouteProp<RootStackParamList>,
    navigation: NavigationProp<RootStackParamList>
}

// One big sloppy compromise :D
function TitleText({
    index,
    string,
    offset,
    length,
    primaryColor,
    secondaryColor
}: {
    index: number,
    string: string,
    offset: SharedValue<number>,
    length: number,
    primaryColor: string,
    secondaryColor: string
}): React.JSX.Element {
    const style = useAnimatedStyle(() => {
        const relativeIndex = index % length;

        const offsetInternal = relativeIndex == 0?
            (offset.value > length-1? offset.value % (length-1) -1:
            offset.value % length): offset.value % length

        return {
            color: interpolateColor(offsetInternal,
                [relativeIndex-1, relativeIndex, relativeIndex+1],
                [secondaryColor, primaryColor, secondaryColor]
            )
        }
    })

    return (
        <Animated.Text
            style={[style, FontStyles.title]}
        >
            {string}
        </Animated.Text>
    )
}

function MetroTabs({
    screens = [],
    route,
    navigation
}: Attributes): React.JSX.Element {
    const [dimensions, setDimensions] = useState({
        width: 100,
        height: 100
    });
    const titleRef = useRef<ScrollView>(null);
    const carouselRef = useRef<ICarouselInstance>(null);

    const offsetArray = useSharedValue<Array<number>>([]);
    const offsetIndex = useSharedValue<number>(0);

    const { theme } = useContext<ThemeContextProps>(ThemeContext);

    const screensTripled = [...screens, ...screens, ...screens, ...screens, ...screens]

    //Reanimated oh my gosh please stfu-
    configureReanimatedLogger({
        level: ReanimatedLogLevel.warn,
        strict: false
    });

    function renderItem ({ item, index }: {item: screenType, index: number}) {
        return (
            <item.component index={index} navigation={navigation} route={route}/>
        )
    }

    function onLayout(e: LayoutChangeEvent) {
        setDimensions({
            width: e.nativeEvent.layout.width,
            height: e.nativeEvent.layout.height
        })
    }

    async function onItemLayout(e:LayoutChangeEvent, index:number) {

        const width = e.nativeEvent.layout.width
        
        // runOnJS(() => {
            offsetArray.modify(array => {
                'worklet';
                if (index == 0) {
                    array[0] = 0;
                }
                array[index+1] = width + array[index]
    
                return array
            });
        // })();
    }

    function renderTitleItem ({ item, index }: { item: screenType, index: number }) {
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    const currentIndex = carouselRef.current?.getCurrentIndex() || 0;

                    carouselRef.current?.next({
                        animated: true,
                        count: (index - currentIndex) % screens.length
                    })
                }}
            >
                <View
                    style={{ alignSelf: "flex-start", paddingLeft: DISTANCE_BETWEEN_TITLES }}
                    onLayout={(e:LayoutChangeEvent) => { onItemLayout(e, index) }}
                >
                    <TitleText
                        index={index}
                        string={item.title}
                        offset={offsetIndex}
                        length={screens.length}
                        primaryColor={Colors[theme].primary}
                        secondaryColor={Colors[theme].secondary}
                    />
                </View>
            </TouchableWithoutFeedback>
        )
    }

    function onProgressChange (offsetProgress: number, absoluteProgress:number) {
        offsetIndex.value = absoluteProgress;

        titleRef.current?.scrollTo({
            animated: false,
            x: interpolate(absoluteProgress % 1,
                [0, 1],
                [offsetArray.value[screens.length*2 + Math.floor(absoluteProgress)], offsetArray.value[screens.length*2 + Math.ceil(absoluteProgress)]]
            )
        })
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ height: 80 }}>
                <ScrollView
                    horizontal
                    scrollEnabled={false}
                    ref={titleRef}
                    showsHorizontalScrollIndicator={false}
                >
                    {screensTripled.map((screen, index) => (renderTitleItem({ item: screen, index: index })))}
                </ScrollView>
            </View>
            <View style={{
                flex: 1,
            }} onLayout={onLayout}>
                <Carousel
                    loop
                    width={dimensions.width*2}
                    height={dimensions.height}
                    
                    data={screens}
                    renderItem={renderItem}
                    onProgressChange={onProgressChange}

                    ref={carouselRef}

                    style={{
                        width: "100%",
                        height: "100%"
                    }}
                />
            </View>
        </View>
    )
}

export default MetroTabs;