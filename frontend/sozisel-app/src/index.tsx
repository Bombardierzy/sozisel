/* eslint-disable sort-imports */
import "./index.scss";
import { I18nextProvider, initReactI18next } from "react-i18next";
import {
  default as commonEN,
  default as commonPL,
} from "../public/locales/pl/common.json";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import App from "./App";
import i18next from "i18next";
import ReactDOM from "react-dom";

i18next.use(initReactI18next).init({
  interpolation: { escapeValue: false },
  lng: navigator.language,
  resources: {
    pl: {
      common: commonPL,
    },
    en: {
      common: commonEN,
    },
  },
});

export const mainTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#ff9800",
      contrastText: "#fff",
    },
    secondary: {
      main: "#ffd18b",
    },
  },
  typography: {
    body2: {
      fontWeight: 400,
      fontSize: 12,
    },
  },
  overrides: {
    MuiOutlinedInput: {
      input: {
        borderRadius: 8,
        background: "#f0f0f0",
      },
      root: {
        borderRadius: 8,
      },
    },
    MuiSelect: {
      outlined: {
        borderRadius: 8,
      },
    },
    MuiButton: {
      root: {
        borderRadius: 8,
      },
    },
  },
});

ReactDOM.render(
  <ThemeProvider theme={mainTheme}>
    <I18nextProvider i18n={i18next}>
      <App />
    </I18nextProvider>
  </ThemeProvider>,
  document.getElementById("root")
);
