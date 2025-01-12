import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TestScreen from './screens/TestScreen';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from './context/ThemeContext';
import { SimProvider } from './context/SimContext';

function App(): React.JSX.Element {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <ThemeProvider>
        <SimProvider>
          <Stack.Navigator
            screenOptions={{
              cardShadowEnabled: false,
              headerShown: false,
            }}
          >
            <Stack.Screen name="Test" component={TestScreen}/>
          </Stack.Navigator>
        </SimProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
}

export default App;
