import "./Navbar.scss";

import { NavLink } from "react-router-dom";
import { ReactElement } from "react";
import logo from "../../../assets/images/logo.png";
import { useTranslation } from "react-i18next";

export default function Navbar(): ReactElement {
  const { t } = useTranslation("common");

  return (
    <nav className="Navbar">
      <ul>
        <li>
          <img src={logo} alt="logo" />
        </li>
        <li>
          <NavLink to="/about" activeClassName="activeLink">
            <p>{t("components.Navbar.aboutLink")}</p>
          </NavLink>
        </li>
      </ul>

      <ul className="LoginNav">
        <li>
          <NavLink to="/register" activeClassName="activeLink">
            <button>{t("components.Navbar.registerLink")}</button>
          </NavLink>
        </li>
        <li>
          <NavLink to="/login" activeClassName="activeLink">
            <button>{t("components.Navbar.loginLink")}</button>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
