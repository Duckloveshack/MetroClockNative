export type ColorTheme = {
    background: string,
    primary: string,
    secondary: string,
    textPrimary: string,
    textSecondary: string
}

type ColorPalettes = {
    light: ColorTheme,
    dark: ColorTheme
}

const Colors: ColorPalettes = {
    light: {
        background: "#ffffff",
        primary: "#abcdef",
        secondary: "#abcdef",
        textPrimary: "#000000",
        textSecondary: "#abcdef"
    },
    dark: {
        background: "#000000",
        primary: "#abcdef",
        secondary: "#abcdef",
        textPrimary: "#ffffff",
        textSecondary: "#7f7f7f"
    }
}

export default Colors;