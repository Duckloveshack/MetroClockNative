import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

export type ThemeContextProps = {
  theme: "light" | "dark",
  themeSetting: "light" | "dark" | "system",
  setTheme: ( newTheme: "light" | "dark" | "system") => void,
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: "dark",
  themeSetting: "system",
  setTheme: ( newTheme: "light" | "dark" | "system" ): void => {},
  isDark: true
});

type Props = {
  children: React.ReactNode
}

export const ThemeProvider = ({
    children
}: Props) => {
  const [theme, setTheme] = useState<"light" | "dark">('dark');
  const [themeSetting, setThemeSetting] = useState<"light" | "dark" | "system" | string>("system");

  const systemTheme: "light" | "dark" = useColorScheme() || "dark";

  useEffect(() => {
    const getTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        setTheme(savedTheme && ( savedTheme === "dark" || savedTheme === "light")? savedTheme: systemTheme);
        setThemeSetting(savedTheme || "system");
      } catch (error) {
        console.log(error);
      }
    };
    getTheme();
  }, [systemTheme]);

  function setThemeExternal( newTheme: "light" | "dark" | "system" ): void {
    AsyncStorage.setItem("theme", newTheme);
    setTheme(newTheme !== "system"? newTheme: systemTheme || "dark");
    setThemeSetting(newTheme);
  }

  return (
    //@ts-ignore
    <ThemeContext.Provider value={{theme: theme, themeSetting: themeSetting, setTheme: setThemeExternal, isDark: theme === "dark"}}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeContext;