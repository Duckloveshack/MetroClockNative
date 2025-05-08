import Animated, { AnimatedProps, AnimatedStyle, Easing, measure, runOnJS, useAnimatedReaction, useAnimatedRef, useAnimatedStyle, useSharedValue, withDelay, withTiming } from "react-native-reanimated";
import { StyleProp, ViewStyle, GestureResponderEvent, StatusBar, useWindowDimensions, ViewProps } from "react-native";
import { useEffect, useRef } from "react";
import { Gesture, GestureDetector, GestureStateChangeEvent, LongPressGestureHandlerEventPayload, PanGestureHandlerEventPayload, Pressable, State, TapGestureHandlerEventPayload, TouchableWithoutFeedback, TouchableWithoutFeedbackProps } from "react-native-gesture-handler";

const PERSPECTIVE = 200;
const MAX_ROTATION = 20;

type Attributes = {
    children: Array<React.ReactElement<any, any>> | React.ReactElement<any, any>,
    onPress?: () => void,
    onLongPress?: () => void,
    onPressIn?: () => void,
    onPressOut?: () => void,
    delayPressIn?: number,
    disabled?: boolean,
    rotateShift?: boolean
    centerShift?: boolean
    style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>,
    ignoreStatusBarHeight?: boolean,
    touchSoundDisabled?: boolean
}

/**
 * @deprecated
 */
function MetroTouchable({
    children,
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    delayPressIn = 0,
    disabled = false,
    rotateShift = true,
    centerShift = false,
    style,
    ignoreStatusBarHeight = false,
    touchSoundDisabled = false
}: Attributes): React.JSX.Element {
    const rotateX = useSharedValue(0);
    const rotateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    const objectProperties = useRef({
        width: 0,
        height: 0,
        centerX: 0,
        centerY: 0
    });
    const pressInTimeout = useRef<NodeJS.Timeout>(null);

    const windowHeight = useWindowDimensions().height;
    const windowWidth = useWindowDimensions().width;

    const ref = useAnimatedRef<Animated.View>();
    
    function onTouchStart(e:GestureResponderEvent) {
        if (!disabled) {
            scale.value = withTiming(0.985, {
                duration: 50,
                easing: Easing.out(Easing.circle)
            });

            ref.current?.measureInWindow((x, y, width, height) => {
                objectProperties.current = {
                    width: width,
                    height: height,
                    centerX: x + width/2,
                    centerY: y + height/2 + (ignoreStatusBarHeight? 0: StatusBar.currentHeight || 0),
                }

                if (centerShift) {
                    translateX.value = withTiming((windowWidth/2-(x+width/2))/100, {
                        duration: 10,
                        easing: Easing.out(Easing.circle)
                    });
                    translateY.value = withTiming((windowHeight/2-(y+width/2))/100, {
                        duration: 10,
                        easing: Easing.out(Easing.circle)
                    });
                }
                onTouchMove(e);
            });

            if (typeof onPressIn == "function") pressInTimeout.current = setTimeout(onPressIn, delayPressIn);
        }
    }

    // should and maybe will replace it :p
    function onTouchMove(e:GestureResponderEvent) {
        if (!disabled && rotateShift) {
            const distanceX = objectProperties.current.centerX - e.nativeEvent.pageX;
            const distanceY = objectProperties.current.centerY - e.nativeEvent.pageY;

            //const distanceZ = (objectProperties.current.height*objectProperties.current.width)/(objectProperties.current.height+objectProperties.current.width)
            const distanceZ = Math.max(objectProperties.current.width, objectProperties.current.height)

            rotateX.value = Math.max(-MAX_ROTATION, 
                Math.min(MAX_ROTATION,
                    Math.atan2( distanceY, distanceZ) * (180 / Math.PI) * ((1 + Math.abs(distanceX / objectProperties.current.width/2)) ** 1.31)
                )
            );

            rotateY.value = Math.max(-MAX_ROTATION, 
                Math.min(MAX_ROTATION,
                    Math.atan2( -distanceX, PERSPECTIVE) * (180 / Math.PI) * ((1 + Math.abs(distanceY / objectProperties.current.height/2)) ** 1.31)
                )
            );
        }
    }

    function onTouchEnd(e:GestureResponderEvent) {
        rotateX.value = withTiming(0, { duration: 100, easing: Easing.out(Easing.circle) });
        rotateY.value = withTiming(0, { duration: 100, easing: Easing.out(Easing.circle) });
        translateX.value = withDelay(250, withTiming(0, { duration: 100, easing: Easing.out(Easing.circle) }));
        translateY.value = withDelay(250, withTiming(0, { duration: 100, easing: Easing.out(Easing.circle) }));
        scale.value = withTiming(1, {
            duration: 200,
            easing: Easing.out(Easing.circle)
        });

        if (typeof onPressOut == "function") onPressOut();

        clearTimeout(pressInTimeout.current!)
    }

    const rotateStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotateX: `${rotateX.value}deg`
            },
            {
                rotateY: `${rotateY.value}deg`
            },
            {
                scale: scale.value
            },
            {
                translateX: translateX.value
            },
            {
                translateY: translateY.value
            }
        ],
        //backgroundColor: "green"
    }))

    return(
            <Animated.View
                style={[style, rotateStyle]}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchEnd} 

                ref={ref}
            >
                {typeof onPress === "function" || typeof onLongPress === "function"? (<Pressable
                    //touchSoundDisabled={touchSoundDisabled}
                    android_disableSound={touchSoundDisabled}
                    onPress={() => { if (typeof onPress == "function" && !disabled) onPress(); }}
                    onLongPress={() => { if (typeof onLongPress == "function" && !disabled) onLongPress(); }}
                >
                    {children}
                </Pressable>) : children }
            </Animated.View>
    )
}

export default MetroTouchable;

type newAttributes = {
    children?: React.ReactNode,

    transformations?: Array<"rotation" | "position" | "scale">,
    enabled?: boolean

    // Named them like this because they have different events from Touchables.
    onTap?: (e: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => void,
    onTapStart?: (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => void,
    onTapEnd?: (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => void,
    onHold?: (e: GestureStateChangeEvent<LongPressGestureHandlerEventPayload>) => void,

    delayTapStart?: number,
    delayTapEnd?: number,
    delayHold?: number
}

export function MetroActionView({
    children,
    style,
    transformations = [ "rotation", "scale" ],
    enabled = true,
    onTap = () => {},
    onTapStart = () => {},
    onTapEnd = () => {},
    onHold = () => {},
    delayTapStart = 0,
    delayTapEnd = 0,
    delayHold = 250,
    ...props
}: newAttributes & Omit<AnimatedProps<ViewProps>, "onTouchStart" | "onTouchMove" | "onTouchEnd" | "onTouchEndCapture" | "onTouchCancel">): React.JSX.Element {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const rotateX = useSharedValue(0);
    const rotateY = useSharedValue(0);
    const scale = useSharedValue(1);

    const windowDimensions = useWindowDimensions();

    const windowWidth = useSharedValue(useWindowDimensions().width);
    const windowHeight = useSharedValue(useWindowDimensions().height);

    useEffect(() => {
        windowWidth.value = windowDimensions.width,
        windowHeight.value = windowDimensions.height
    }, [windowDimensions])

    const view = useSharedValue({
        width: 0,
        height: 0,
        centerX: 0,
        centerY: 0,
        pivotX: 0,
        pivotY: 0
    });
    const viewRef = useAnimatedRef<Animated.View>();

    const tapStartTimeout = useRef<NodeJS.Timeout>(null);

    //I don't want to look at Math.min(Math.max(function stuff))
    function absLimitDegree(value: number) {
        'worklet';
        return Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, value));
    }

    const panGestureAnimation = Gesture.Pan()
        .enabled(enabled)
        .shouldCancelWhenOutside(true)
        .minDistance(0)
        .onStart((e) => {
            const measurements = measure(viewRef);

            if (measurements !== null) {
                const centerX = measurements.pageX + measurements.width / 2;
                const centerY = measurements.pageY + measurements.height / 2;

                view.value = {
                    width: measurements.width,
                    height: measurements.height,
                    centerX: measurements.width / 2,
                    centerY: measurements.height / 2,
                    pivotX: measurements.width * (0.09 * MAX_ROTATION),
                    pivotY: measurements.height * (0.09 * MAX_ROTATION)
                };

                if (transformations.includes("position")) {
                    translateX.value = withTiming((windowWidth.value/2 - centerX) / 100, {
                        duration: 10,
                        easing: Easing.out(Easing.circle)
                    });
                    translateY.value = withTiming((windowHeight.value/2 - centerY) / 100, {
                        duration: 10,
                        easing: Easing.out(Easing.circle)
                    });
                }
            }

            if (transformations.includes("scale")) {
                const scaleShift = PERSPECTIVE / (PERSPECTIVE + 5)
                scale.value = withTiming(scaleShift, {
                    duration: 50,
                    easing: Easing.out(Easing.circle)
                })
            }
        })
        .onUpdate((e) => {
            if (transformations.includes("rotation")) {
                const distanceX = e.x - view.value.centerX;
                const distanceY = e.y - view.value.centerY;

                const angleX = absLimitDegree(Math.atan2(-distanceX, view.value.pivotX) * 180/Math.PI) * Math.PI/180;
                const angleY = absLimitDegree(Math.atan2(distanceX, view.value.pivotY) * 180/Math.PI) * Math.PI / 180;
    
                //need to account for spherical curvature
                rotateX.value = absLimitDegree(Math.atan2(-distanceY, view.value.pivotX) * 180/Math.PI);
                rotateY.value = absLimitDegree(Math.atan2(distanceX, view.value.pivotY) * 180/Math.PI);
            }
        })
        .onEnd((e) => {
            const delay = e.state === State.CANCELLED? 250: 0;

            translateX.value = withDelay(delay, withTiming(0, { duration: 100, easing: Easing.in(Easing.circle) }));
            translateY.value = withDelay(delay, withTiming(0, { duration: 100, easing: Easing.in(Easing.circle) }));
            rotateX.value = withDelay(delay, withTiming(0, { duration: 100, easing: Easing.in(Easing.circle) }));
            rotateY.value = withDelay(delay, withTiming(0, { duration: 100, easing: Easing.in(Easing.circle) }));
            scale.value = withDelay(delay, withTiming(1, { duration: 100, easing: Easing.in(Easing.circle) }));
        });

    const panGestureFunctional = Gesture.Pan()
        .enabled(enabled)
        .runOnJS(true)
        .minDistance(0)
        .shouldCancelWhenOutside(true)
        .onStart((e) => {
            if (tapStartTimeout.current) clearTimeout(tapStartTimeout.current);
            tapStartTimeout.current = setTimeout(() => { onTapStart(e) }, delayTapStart);
        })
        .onEnd((e) => {
            clearTimeout(tapStartTimeout.current!);
            setTimeout(() => { onTapEnd(e) }, delayTapEnd);
        });

    const longPressGesture = Gesture.LongPress()
        .enabled(enabled)
        .shouldCancelWhenOutside(true)
        .minDuration(delayHold)
        .runOnJS(true)
        .onEnd(onHold);

    const tapGesture = Gesture.Tap()
        .enabled(enabled)
        .shouldCancelWhenOutside(true)
        .runOnJS(true)
        .onStart(onTap);
        
    const combinedGesture = Gesture.Simultaneous(tapGesture, panGestureAnimation, panGestureFunctional, longPressGesture);

    const transformStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { rotateX: `${rotateX.value}deg` },
            { rotateY: `${rotateY.value}deg` },
            { scale: scale.value }
        ]
    }));

    return (
        <GestureDetector gesture={combinedGesture} userSelect="auto">
            <Animated.View style={[transformStyle, style]} ref={viewRef} {...props}>
                {children}
            </Animated.View>
        </GestureDetector>
    )
}