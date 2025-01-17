import MaskedView from "@react-native-masked-view/masked-view";
import { useEffect, useState, useRef, useLayoutEffect } from "react";
import {NativeScrollEvent, ScrollView, View, Dimensions, useWindowDimensions } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withDecay, withClamp, clamp, ReduceMotion, useAnimatedRef, measure, runOnUI, runOnJS } from "react-native-reanimated";

type Attributes = {
    children?: Array<React.ReactElement<any, any>> | React.ReactElement<any, any>
}

// very much a work-in-progress :/
function MetroScroll({
    children
}: Attributes): React.JSX.Element {
    const translateY = useSharedValue(0);
    const currentTranslateY = useSharedValue(0);

    const [dimensions, setDimensions] = useState({ width: 0, height: 0, outerWidth: 0, outerHeight: 0});
    const innerRef = useRef<View>(null);
    const outerRef = useRef<View>(null);

    const windowHeight = useWindowDimensions().height;
    //console.log(windowHeight)

    useEffect(() => {
      outerRef.current?.measure((xOut:number, yOut:number, outerWidth:number, outerHeight:number, outerX:number, outerY:number) => {
        innerRef.current?.measure((x:number, y:number, width:number, height:number, pageX:number, pageY:number) => {
          setDimensions({
            width: width,
            height: height-outerHeight,
            outerWidth: outerWidth,
            outerHeight: outerHeight
          });
        });
      })
    }, [innerRef, outerRef, windowHeight, children]);

    const panGesture = Gesture.Pan()
      .enabled(dimensions.height > 0)
      .runOnJS(true)
      .onBegin((e) => {
        currentTranslateY.value = translateY.value;
      })
      .onUpdate((e) => {
        translateY.value = clamp(e.translationY + currentTranslateY.value, -dimensions.height-25, 25);
      })
      .onEnd((e) => {
        translateY.value = withClamp(
          { min: -dimensions.height-25, max: 25},
          withDecay({
            velocity: e.velocityY,
            //deceleration: 0.997,
            clamp: [ -dimensions.height, 0],
            rubberBandEffect: true,
            rubberBandFactor: Math.max(Math.abs(e.velocityY / 750), 1),
            reduceMotion: ReduceMotion.System
           })
          );
      })

    const translateStyle = useAnimatedStyle(() => ({
      transform: [
        {
          translateY: translateY.value
        },
        {
          scaleY: dimensions.height > 0? (translateY.value > 0? 1 - translateY.value / 500: translateY.value < -dimensions.height? 1 + (translateY.value+dimensions.height) / 500: 1): 1
        }
      ]
    }));
  
    return (
      <View ref={outerRef} style={{ flex: 1 }}>
        <GestureDetector gesture={panGesture}>
          <MaskedView
              maskElement={
                <View style={{ width: "100%", height: dimensions.outerHeight, backgroundColor: "white" }}/>
              }
          >
            <Animated.View style={[translateStyle]}>
                <View ref={innerRef}>
                  {children}
                </View>
            </Animated.View>
          </MaskedView>
        </GestureDetector>
      </View>
    );
}

export default MetroScroll