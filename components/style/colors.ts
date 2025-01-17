export type ColorTheme = {
    background: string,
    foreground: string,
    primary: string,
    secondary: string,
}

type ColorPalettes = {
    light: ColorTheme,
    dark: ColorTheme
}

const Colors: ColorPalettes = {
    light: {
        background: "#ffffff",
        foreground: "#d0d0d0",
        primary: "#000000",
        secondary: "#808080",
    },
    dark: {
        background: "#000000",
        foreground: "#202020",
        primary: "#ffffff",
        secondary: "#7f7f7f",
    }
}

export default Colors;