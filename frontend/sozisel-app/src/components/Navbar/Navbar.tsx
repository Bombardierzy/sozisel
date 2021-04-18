import "./Navbar.scss";

import { Link } from "react-router-dom";
import { ReactElement } from "react";
import logo from "../../assets/images/logo.png";
import { useTranslation } from "react-i18next";

export default function Navbar(): ReactElement {
  const { t } = useTranslation("common");

  return (
    <nav className="Navbar">
      <ul>
        <li>
          <img src={logo} alt="logo" />
        </li>
        <li>{t("components.Navbar.aboutLink")}</li>
      </ul>

      <ul className="LoginNav">
        <li>
          <Link to="/register">{t("components.Navbar.registerLink")}</Link>
        </li>
        <li>
          <Link to="/login">
            <button className="loginButton">
              {t("components.Navbar.loginLink")}
            </button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
