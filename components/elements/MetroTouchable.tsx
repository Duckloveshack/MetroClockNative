import Animated, { Easing, useAnimatedRef, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { TouchableWithoutFeedback, StyleProp, ViewStyle, GestureResponderEvent, StatusBar } from "react-native";
import { useRef } from "react";

const PERSPECTIVE = 200;
const MAX_ROTATION = 20

type Attributes = {
    children: Array<React.ReactElement<any, any>> | React.ReactElement<any, any>,
    onPress?: () => void,
    disabled?: boolean,
    style?: StyleProp<ViewStyle>
}

function MetroTouchable({
    children,
    onPress,
    disabled = false,
    style
}: Attributes): React.JSX.Element {
    const rotateX = useSharedValue(0);
    const rotateY = useSharedValue(0);
    const scale = useSharedValue(1);
    const objectProperties = useRef({
        width: 0,
        height: 0,
        centerX: 0,
        centerY: 0
    });

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
                    centerY: y + height/2 + (StatusBar.currentHeight || 0)
                }
                onTouchMove(e);
            })
        }
    }

    // should and maybe will replace it :p
    function onTouchMove(e:GestureResponderEvent) {
        if (!disabled) {
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
        scale.value = withTiming(1, {
            duration: 200,
            easing: Easing.out(Easing.circle)
        });
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
            }
        ],
        //backgroundColor: "green"
    }))

    return(
        <TouchableWithoutFeedback
            onPress={() => { if (typeof onPress == "function" && !disabled) onPress(); }}
        >
            <Animated.View
                style={[style, rotateStyle]}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchEnd}

                ref={ref}
            >
                {children}
            </Animated.View>
        </TouchableWithoutFeedback>
    )
}

export default MetroTouchable;