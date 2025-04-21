import React, { useContext, useEffect, useRef } from 'react';
import { createStackNavigator, StackCardInterpolatedStyle, StackCardInterpolationProps } from '@react-navigation/stack';
import TestScreen from './screens/TestScreen';
import { NavigationContainer, useNavigationContainerRef, createNavigationContainerRef } from '@react-navigation/native';
import ThemeContext, { ThemeProvider } from './context/ThemeContext';
import { SimProvider } from './context/SimContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LocalizationProvider } from './context/LocalizationContext';
import SettingsScreen from './screens/SettingsScreen';
import { Easing } from 'react-native';
import Colors from './components/style/colors';
import type { RootStackParamList } from './types/screens';
import ModalScreen from './screens/ModalScreen';
import MainScreen from './screens/MainScreen';
import BootSplash from "react-native-bootsplash";
import SplashScreen from './screens/_SplashScreen';
import DialScreen from './screens/DialScreen';
import CallScreen from './screens/CallScreen';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

function App(): React.JSX.Element {
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide();
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <SafeAreaProvider>
        <ThemeProvider>
          <SimProvider>
            <LocalizationProvider>
              <GestureHandlerRootView>
                <NavigatorComponent/>
              </GestureHandlerRootView>
            </LocalizationProvider>
          </SimProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

function NavigatorComponent(): React.JSX.Element {
  const { theme } = useContext(ThemeContext);

  const Stack = createStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator
      screenOptions={{
        cardShadowEnabled: false,
        headerShown: false,
        cardStyleInterpolator: ({ current, next, layouts}: StackCardInterpolationProps): StackCardInterpolatedStyle => {
          return {
            cardStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0.66, 1],
                outputRange: [0, 1],
                extrapolate: "clamp"
              }),
              
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0.66, 0.84, 0.98],
                    outputRange: [-layouts.screen.width/2+5, -layouts.screen.width/8.75+5,  0],
                    extrapolate: "clamp"
                  })
                },
                {
                  rotateY: current.progress.interpolate({
                    inputRange: [0.66, 1],
                    outputRange: ["90deg", "0deg"],
                    extrapolate: "clamp"
                  })
                },
                {
                  scale: current.progress.interpolate({
                    inputRange: [0.66, 1],
                    outputRange: [0.7, 1],
                    extrapolate: "clamp"
                  })
                },
        
                {
                  rotateY: next
                  ? next.progress.interpolate({
                    inputRange: [0, 0.33],
                    outputRange: ["0deg", "-90deg"],
                    extrapolate: "clamp"
                  }): "0deg"
                },
                {
                  translateX: next
                  ? next.progress.interpolate({
                    inputRange: [0.02, 0.1, 0.33],
                    outputRange: [0, -layouts.screen.width/11, -layouts.screen.width],
                    extrapolate: "clamp"
                  }): 0
                },
                {
                  scale: next
                  ? next.progress.interpolate({
                    inputRange: [0, 0.33],
                    outputRange: [1, 1.25],
                    extrapolate: "clamp"
                  }): 1
                }
              ],
            },
            overlayStyle: {
              opacity: current.progress.interpolate({
                inputRange: [0.00, 0.33],
                outputRange: [0, 1],
                extrapolate: "clamp"
              }),
              backgroundColor: Colors[theme].background,
            }
          }
        },
        transitionSpec: {
          open: {
            animation: "timing",
            config: {
              duration: 800,
              easing: Easing.inOut(Easing.back(0))
            }
          },
          close: {
            animation: "timing",
            config: {
              duration: 800,
              easing: Easing.inOut(Easing.back(0))
            }
          }
        }
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen}/>
      <Stack.Screen name="Test" component={TestScreen}/>
      <Stack.Screen name="MainScreen" component={MainScreen}/>
      <Stack.Screen name="DialScreen" component={DialScreen} options={{
        cardStyleInterpolator: ({current, layouts}): StackCardInterpolatedStyle => ({
          cardStyle: {
            transform: [{
              translateY: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.height, 0]
              })
            }]
          }
        }),
        transitionSpec: {
          open: {
            animation: "timing",
            config: {
              duration: 500,
              easing: Easing.out(Easing.poly(3))
            }
          },
          close: {
            animation: "timing",
            config: {
              duration: 500,
              easing: Easing.out(Easing.poly(3))
            }
          }
        }
      }}/>
      <Stack.Screen name="SettingsScreen" component={SettingsScreen}/>
      <Stack.Screen name="ModalScreen" component={ModalScreen} options={{
        detachPreviousScreen: false,
        presentation: "transparentModal",
        cardStyleInterpolator: (): StackCardInterpolatedStyle => ({}),
        transitionSpec: {
          open: {
            animation: "timing",
            config: {
              duration: 0,
            }
          },
          close: {
            animation: "timing",
            config: {
              duration: 200,
            }
          }
        }
      }}/>
    </Stack.Navigator>
  )
}

export default App;
