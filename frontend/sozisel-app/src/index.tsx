import "./index.scss";

import { I18nextProvider, initReactI18next } from "react-i18next";

import App from "./App";
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/core";
import common from "../public/locales/pl/common.json";
import { createMuiTheme } from "@material-ui/core/styles";
import i18next from "i18next";

i18next.use(initReactI18next).init({
  interpolation: { escapeValue: false },
  lng: "pl",
  resources: {
    pl: {
      common,
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
