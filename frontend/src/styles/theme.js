import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#0c5250"
    },
    secondary: {
      main: "#f3b34a"
    },
    background: {
      default: "#f4f8f8",
      paper: "#ffffff"
    },
    text: {
      primary: "#173130",
      secondary: "#597271"
    }
  },
  typography: {
    fontFamily: '"Segoe UI", "Trebuchet MS", sans-serif',
    h2: {
      fontSize: "clamp(2.25rem, 4vw, 4rem)",
      fontWeight: 800,
      lineHeight: 1.05
    },
    h3: {
      fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
      fontWeight: 700
    },
    h5: {
      fontWeight: 700
    },
    button: {
      textTransform: "none",
      fontWeight: 700
    }
  },
  shape: {
    borderRadius: 18
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          paddingInline: 18
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true
      }
    }
  }
});

export default theme;
