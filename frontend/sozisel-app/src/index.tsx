import "./index.scss";

import App from "./App";
import { I18nextProvider } from "react-i18next";
import React from "react";
import ReactDOM from "react-dom";
import common from "../public/locales/pl/common.json";
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

ReactDOM.render(
  <I18nextProvider i18n={i18next}>
    <App />
  </I18nextProvider>,
  document.getElementById("root")
);
