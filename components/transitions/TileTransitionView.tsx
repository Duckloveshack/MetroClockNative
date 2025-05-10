import { useFocusEffect } from "@react-navigation/native";
import { Canvas, Image, makeImageFromView, SkImage } from "@shopify/react-native-skia";
import { isNull } from "lodash";
import { Component, RefObject, useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, View, ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

type ItemAttributes = {
    image: SkImage,
    height: number,
    offset: number,
    index: number,
    isFocus: boolean
}

function TileTransitionItem({
    image,
    height = 0,
    offset = 0,
    index = -1,
    isFocus = true
}: ItemAttributes): React.JSX.Element {
    const tileRotation = useSharedValue<`${number}%`>("90%");

    useFocusEffect(useCallback(() => {
        tileRotation.value = withDelay(isFocus? 150: 0 + index*10,
            withTiming(isFocus? "0%": "-90%", {
                duration: 50,
                easing: isFocus? Easing.out(Easing.circle): Easing.in(Easing.circle)
            })
        );
    }, []));

    return (
        <Image
            image={image}
            x={0}
            y={-offset}
            width={windowWidth}
            height={height}
        />
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
    const [image, setImage] = useState<SkImage | null>(null);
    const [isFocus, setIsFocus] = useState<boolean>(true);
    const [showContent, setShowContent] = useState<boolean>(false);

    const viewRef = useRef<View>(null);

    useFocusEffect(useCallback(() => {
        async function createSnapshot() {
            const snapshot = await makeImageFromView(viewRef as RefObject<Component<unknown, unknown, any>>);
            setImage(snapshot);
        }
        createSnapshot();

        return () => {
            setIsFocus(false);
            createSnapshot();
        }
    }, []));

    useEffect(() => {
        if (!isNull(image)) {
            if (isFocus) {
                setTimeout(() => {
                    setShowContent(true);
                }, 230)
            } else {
                setShowContent(false);
            }
        }
    }, [image])

    return (
        <View style={{
            position: "relative"
        }}>
            <View ref={viewRef} collapsable={true} removeClippedSubviews={true} style={[{
                opacity: 1
            }, style]}>
                {children}
            </View>
            <Canvas></Canvas>
        </View>
    )
}

export default TileTransitionView;