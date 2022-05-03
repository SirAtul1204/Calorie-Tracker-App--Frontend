import { createTheme, ThemeOptions } from "@mui/material";
import { blue } from "@mui/material/colors";

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: "#151D3B",
    },
    secondary: {
      main: "#2FA4FF",
      // main: "#efefef",
    },
    success: {
      main: blue[500],
    },
    error: {
      main: "#f00",
    },
  },
};

export const theme = createTheme(themeOptions);
