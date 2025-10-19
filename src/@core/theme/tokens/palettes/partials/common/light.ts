import { alpha } from "@mui/material/styles";

export const neutral = {
  10: "#FFFFFF",
  20: "#FAFAFA",
  30: "#EDEDED",
  40: "#E0E0E0",
  50: "#C2C2C2",
  60: "#9E9E9E",
  70: "#757575",
  80: "#616161",
  90: "#404040",
  100: "#1D1F20",
};

export const brand = {
  primary: {
    main: "#01959F",
    surface: "#F3FBFC",
    border: "#4DB5BC",
    hover: "#01777F",
    pressed: "#01595F",
    focus: alpha("#01959F", 0.2),
  },
  secondary: {
    main: "#FBC037",
    surface: "#FFFCF5",
    border: "#FEEABC",
    hover: "#F8A92F",
    pressed: "#FA9810",
    focus: alpha("#FBC037", 0.2),
  },
  danger: {
    main: "#E01428",
    surface: "#FFF9FA",
    border: "#F5B1B7",
    hover: "#BC1121",
    pressed: "#700A14",
    focus: alpha("#E01428", 0.2),
  },
  warning: {
    main: "#CA7336",
    surface: "#FCF7F3",
    border: "#FEB17B",
    hover: "#B1652F",
    pressed: "#985628",
    focus: alpha("#CA7336", 0.2),
  },
  success: {
    main: "#43936C",
    surface: "#F7F7F7",
    border: "#B8DBCA",
    hover: "#367459",
    pressed: "#20573D",
    focus: alpha("#43936C", 0.2),
  },
};

export const lightTokens = {
  palette: {
    mode: "light" as const,
    primary: {
      main: brand.primary.main,
      dark: brand.primary.pressed,
      light: brand.primary.hover,
      contrastText: "#fff",
    },
    secondary: {
      main: brand.secondary.main,
      dark: brand.secondary.pressed,
      light: brand.secondary.hover,
      contrastText: "#1D1F20",
    },
    error: {
      main: brand.danger.main,
      dark: brand.danger.pressed,
      light: brand.danger.hover,
    },
    warning: {
      main: brand.warning.main,
      dark: brand.warning.pressed,
      light: brand.warning.hover,
    },
    success: {
      main: brand.success.main,
      dark: brand.success.pressed,
      light: brand.success.hover,
    },
    info: { main: brand.primary.main },
    grey: {
      50: neutral[20],
      100: neutral[30],
      200: neutral[40],
      300: neutral[50],
      400: neutral[60],
      500: neutral[70],
      600: neutral[80],
      700: neutral[90],
      800: "#232425",
      900: neutral[100],
    },
    text: {
      primary: neutral[100],
      secondary: neutral[80],
      disabled: alpha(neutral[100], 0.38),
    },
    divider: neutral[40],
    background: {
      default: "#d5d6d8",
      paper: "#fafafa",
    },
  },
  shape: { borderRadius: 12 },
};

export const gradients = {
  authRight:
    "radial-gradient(1200px 400px at -10% -10%, rgba(77,181,188,.28), transparent 60%), linear-gradient(180deg,#01777F,#01595F)",
};

export const elevations = {
  input: "0 1px 2px rgba(2,6,23,.06), 0 1px 1px rgba(2,6,23,.04)",
  button: "0 6px 20px rgba(1,149,159,.20)",
  modal: "0 24px 48px rgba(29,31,32,.24)",
};
