import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type SavedTheme = "light" | "dark" | "system";
type FunctionalTheme = "light" | "dark"

export type ThemeContextProps = {
  theme: FunctionalTheme,
  themeSetting: SavedTheme,
  setTheme: ( newTheme: SavedTheme) => void,
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "dark",
  themeSetting: "system",
  setTheme: (): void => {},
  isDark: true
});

type Props = {
  children: React.ReactNode
}

export const ThemeProvider = ({
    children
}: Props) => {
  const [theme, setTheme] = useState<FunctionalTheme>('dark');
  const [themeSetting, setThemeSetting] = useState<"light" | "dark" | "system">("system");

  const systemTheme: FunctionalTheme = useColorScheme() || "dark";

  useEffect(() => {
    const getTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme') as SavedTheme;
        setTheme(savedTheme && ( savedTheme === "dark" || savedTheme === "light")? savedTheme: systemTheme);
        setThemeSetting(savedTheme || "system");
      } catch (error) {
        console.log(error);
      }
    };
    getTheme();
  }, [systemTheme]);

  function setThemeExternal( newTheme: SavedTheme ): void {
    AsyncStorage.setItem("theme", newTheme);
    setTheme(newTheme !== "system"? newTheme: systemTheme || "dark");
    setThemeSetting(newTheme);
  }

  return (
    <ThemeContext.Provider value={{theme: theme, themeSetting: themeSetting, setTheme: setThemeExternal, isDark: theme === "dark"}}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeContext;