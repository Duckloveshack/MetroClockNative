import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TestScreen from './screens/TestScreen';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './context/ThemeContext';
import { SimProvider } from './context/SimContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LocalizationProvider } from './context/LocalizationContext';

export type RootStackParamList = {
  Test: undefined
}

function App(): React.JSX.Element {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <ThemeProvider>
          <SimProvider>
            <LocalizationProvider>
              <GestureHandlerRootView>
                <Stack.Navigator
                  screenOptions={{
                    cardShadowEnabled: false,
                    headerShown: false,
                  }}
                >
                  <Stack.Screen name="Test" component={TestScreen}/>
                </Stack.Navigator>
              </GestureHandlerRootView>
            </LocalizationProvider>
          </SimProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

export default App;
