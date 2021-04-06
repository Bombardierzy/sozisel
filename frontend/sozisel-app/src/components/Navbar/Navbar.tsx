import "./Navbar.scss";

import { Link } from "react-router-dom";
import { ReactElement } from "react";
import logo from "../../assets/logo.png";
import { useTranslation } from "react-i18next";

export default function Navbar(): ReactElement {
  const { t } = useTranslation("common");

  return (
    <nav>
      <ul>
        <li>
          <img src={logo} alt="logo" />
        </li>
        <li>{t("components.Navbar.aboutLink")}</li>
      </ul>

      <ul className="login-nav">
        <li>
          <Link to="/register">{t("components.Navbar.registerLink")}</Link>
        </li>
        <li className="login-button">
          <Link to="/login">{t("components.Navbar.loginLink")}</Link>
        </li>
      </ul>
    </nav>
  );
}
