import "./MainNavbar.scss";

import ComputerIcon from "@material-ui/icons/Computer";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import InsertDriveFileOutlinedIcon from "@material-ui/icons/InsertDriveFileOutlined";
import { NavLink } from "react-router-dom";
import { ReactElement } from "react";
import { USER_TOKEN } from "../../../common/consts";
import logo from "../../../assets/images/logo.png";
import { useTranslation } from "react-i18next";

export default function MainNavbar(): ReactElement {
  const { t } = useTranslation("common");
  return (
    <nav className="MainNavbar">
      <ul>
        <li>
          <img src={logo} alt="logo" />
        </li>
        <li>
          <NavLink to="/sessions" activeClassName="activeLink" className="link">
            <ComputerIcon />
            <p>{t("components.MainNavbar.sessionsLinkText")}</p>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/templates"
            activeClassName="activeLink"
            className="link"
          >
            <FolderOpenIcon />
            <p>{t("components.MainNavbar.templatesLinkText")}</p>
          </NavLink>
        </li>
        <li>
          <NavLink to="/files" activeClassName="activeLink" className="link">
            <InsertDriveFileOutlinedIcon />
            <p>{t("components.MainNavbar.files")}</p>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/login"
            activeClassName="activeLink"
            className="link"
            onClick={() => localStorage.removeItem(USER_TOKEN)}
          >
            <p>{t("components.MainNavbar.logoutText")}</p>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
