import { useFocusEffect } from "@react-navigation/native";
import { isUndefined } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Text, ViewStyle } from "react-native";
import { Dimensions, Image, ImageSourcePropType, LayoutChangeEvent, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import ViewShot, { captureRef } from "react-native-view-shot";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

type ItemAttributes = {
    uri: string,
    height: number,
    offset: number,
    index: number,
    isFocus: boolean
}

function TileTransitionItem({
    uri = "",
    height = 0,
    offset = 0,
    index = -1,
    isFocus = true
}: ItemAttributes): React.JSX.Element {
    const tileRotation = useSharedValue<number>(90);

    useFocusEffect(useCallback(() => {
        tileRotation.value = withDelay(isFocus? 150: 0 + index*10,
            withTiming(isFocus? 0: -90, {
                duration: 50,
                easing: isFocus? Easing.out(Easing.circle): Easing.in(Easing.circle)
            })
        );
    }, []));

    const rotationStyle = useAnimatedStyle(() => ({
        transform: [{ rotateX: `${tileRotation.value}deg` }]
    }));

    return (
        <Animated.View key={index} style={[{
            height: height,
            width: windowWidth,
            overflow: "hidden"
        }, rotationStyle]}>
            <Image
                source={{ uri: uri }}
                height={800}
                style={{
                    transform: [{ translateY: -offset }],
                }}
            />
        </Animated.View>
    )
}

type Attributes = {
    children: React.ReactNode,
    style?: ViewStyle
}

function TileTransitionView({
    children,
    style
}: Attributes): React.JSX.Element {
    const [uri, setUri] = useState<string>();
    const [isFocus, setIsFocus] = useState<boolean>(true);
    const [showContent, setShowContent] = useState<boolean>(false);

    const shotRef = useRef<ViewShot>(null);

    useEffect(() => {
        captureRef(shotRef, {
            format: "jpg",
            quality: 0.5,
            result: "tmpfile"
        }).then((uri) => {
            setUri(uri);
            setTimeout(() => { setShowContent(true) }, 300)
        });
    }, []);

    useFocusEffect(useCallback(() => {
        return(() => {
            setShowContent(false);
            captureRef(shotRef, {
                format: "jpg",
                quality: 0.5,
                result: "tmpfile"
            }).then((uri) => {
                setUri(uri);
                setIsFocus(false);
            });
        });
    }, []));

    return (
        <View style={{
            position: "relative"
        }}>
            <ViewShot
                ref={shotRef}
                style={{
                    opacity: showContent? 1: 0
                }}
                
            >
                <View>
                    {children}
                </View>
            </ViewShot>
            <View style={{
                position: "absolute",
                height: windowHeight*8,
                opacity: showContent? 0: 1,
                gap: 0
            }}>
                {[...Array(8).keys()].map((_key, index) => {
                    return (
                        <TileTransitionItem
                            key={index}
                            uri={uri!}
                            height={windowHeight/8}
                            offset={windowHeight/8*index}
                            index={index}
                            isFocus={isFocus}
                        />
                    );
                })}
            </View>
        </View>
    )
}

export default TileTransitionView;