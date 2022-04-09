/* eslint-disable sort-imports */
import "./index.scss";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { default as commonPL } from "../public/locales/pl/common.json";
import { default as commonEN } from "../public/locales/en/common.json";
import { ThemeProvider } from "@material-ui/core";
import { createMuiTheme } from "@material-ui/core/styles";
import App from "./App";
import i18next from "i18next";
import ReactDOM from "react-dom";
import LanguageDetector from "i18next-browser-languagedetector";

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    resources: {
      pl: {
        common: commonPL,
      },
      en: {
        common: commonEN,
      },
    },
  });

i18next.changeLanguage();

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
