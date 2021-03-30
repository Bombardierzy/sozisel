import "./navbar.scss";

import { ReactElement } from "react";
import logo from "../../assets/logo.png";

export default function Navbar(): ReactElement {
  return (
    <nav>
      <ul>
        <li>
          <img src={logo} alt="logo" />
        </li>
        <li>O Projekcie</li>
        <li>Pomoc</li>
      </ul>

      <ul className="login-nav">
        <li>Rejestracja</li>
        <li className="login-button">Logowanie</li>
      </ul>
    </nav>
  );
}
