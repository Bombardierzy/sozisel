import "./BasicNavbar.scss";

import { ReactElement } from "react";
import logo from "../../../assets/images/logo.png";

export default function BasicNavbar(): ReactElement {
  return (
    <nav className="BasicNavbar">
      <ul>
        <li>
          <img src={logo} alt="logo" />
        </li>
      </ul>
    </nav>
  );
}
