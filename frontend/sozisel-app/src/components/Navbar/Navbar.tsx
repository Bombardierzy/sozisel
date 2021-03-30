import "./navbar.scss";

import { ReactElement } from "react";
import logo from "../../assets/logo.png";
import { useHistory } from "react-router";

export default function Navbar(): ReactElement {
  const history = useHistory();

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
        <li onClick={() => history.push("/register")}>Rejestracja</li>
        <li onClick={() => history.push("/")} className="login-button">
          Logowanie
        </li>
      </ul>
    </nav>
  );
}
