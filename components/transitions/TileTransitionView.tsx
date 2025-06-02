import { useFocusEffect } from "@react-navigation/native";
import { Canvas, Image, makeImageFromView, SkImage } from "@shopify/react-native-skia";
import { isNull } from "lodash";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { View, ViewStyle } from "react-native";
import Animated, { Easing, useSharedValue, withDelay, withTiming } from "react-native-reanimated";

//kill me

type ItemAttributes = {
    image: SkImage,
    height: number,
    width: number,
    offset: number,
    index: number,
    isFocus: boolean
}

function TileTransitionItem({
    image,
    height = 0,
    width = 0,
    offset = 0,
    index = -1,
    isFocus = true
}: ItemAttributes): React.JSX.Element {
    const tileRotation = useSharedValue<`${number}deg`>("90deg");

    useEffect(useCallback(() => {
        tileRotation.value = withDelay((isFocus? 0: 0) + index*10,
            withTiming(isFocus? "0deg": "-90deg", {
                duration: 50,
                easing: isFocus? Easing.out(Easing.circle): Easing.in(Easing.circle)
            })
        );
    }, []));

    return (
        <Animated.View style={{transform: [{ rotateX: tileRotation }]}}>
            <Canvas style={{
                width: width,
                height: height,
                //backgroundColor: '#' + Math.floor(Math.random()*16777215).toString(16)
            }} >
                <Image
                    image={image}
                    x={0}
                    y={-offset}
                    width={width}
                    height={height*8}
                />
            </Canvas>
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
    const [image, setImage] = useState<SkImage | null>(null);
    const [isFocus, setIsFocus] = useState<boolean>(true);
    const [showContent, setShowContent] = useState<boolean>(false);

    const [width, setWidth] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    const viewRef = useRef<View>(null);
    
    async function createSnapshot() {
        if (!isNull(image)) image.dispose();
        if (!isNull(viewRef.current)) {
            const snapshot = await makeImageFromView(viewRef as RefObject<View>)
            if (!isNull(snapshot)) setImage(snapshot);
        }
    };

    useFocusEffect(useCallback(() => {
        return () => {
            setIsFocus(false);
            //createSnapshot();
        }
    }, []));

    useEffect(() => {
        if (!isNull(image)) {
            if (isFocus) {
                setTimeout(() => {
                    setShowContent(true);
                }, 2030)
            } else {
                setShowContent(false);
            }
        }
    }, [image]);

    useEffect(() => {
        return () => {
            if (image) {
                image.dispose?.();
            }
        };
    }, [image]);

    useEffect(() => {
        let frame: number;

        const checkReady = () => {
            if (viewRef.current) {
                viewRef.current.measure((_x, _y, width, height) => {
                    if (width !== 0 && height !== 0) {
                        setWidth(width);
                        setHeight(height);
                        createSnapshot();
                    } else {
                        frame = requestAnimationFrame(checkReady); // keep checking
                    }
                });
            } else {
                frame = requestAnimationFrame(checkReady); // keep checking
            }
        };

        frame = requestAnimationFrame(checkReady);

        return () => cancelAnimationFrame(frame); // cleanup
    }, []);

    return (
        <View style={{
            position: "relative",
        }}>
            <View
                ref={viewRef}
                collapsable={false}
                style={[{ opacity: showContent? 1: 0}, style]}
            >
                {children}
            </View>
            {showContent? <></>: <View style={{
                position: "absolute",
                zIndex: 1
            }}>
                {isNull(image)? <></>: [...Array(8).keys()].map((_key, index) => {
                    return (
                        <TileTransitionItem
                            //@ts-ignore
                            key={`tile-${index}-${viewRef.current!.__nativeTag}`}
                            image={image!}
                            height={height/8}
                            width={width}
                            offset={height/8*index}
                            index={index}
                            isFocus={isFocus}
                        />
                    );
                })}
            </View>}
        </View>
    )
}

export default TileTransitionView;