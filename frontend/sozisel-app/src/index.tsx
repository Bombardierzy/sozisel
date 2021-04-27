import "./index.scss";

import App from "./App";
import { I18nextProvider } from "react-i18next";
import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/core";
import common from "../public/locales/pl/common.json";
import { createMuiTheme } from "@material-ui/core/styles";
import i18next from "i18next";

i18next.init({
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
      contrastText: "white",
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
        background: "#f0f0f0",
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
