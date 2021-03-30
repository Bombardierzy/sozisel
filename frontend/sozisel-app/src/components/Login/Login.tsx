import "./login.scss";

import Button from "../utils/Button/Button";
import Card from "../utils/Card/Card";
import Input from "../utils/Input/Input";
import Navbar from "../Navbar/Navbar";
import { ReactElement } from "react";
import conference_img from "../../assets/conference_img.png";

export default function Login(): ReactElement {
  return (
    <>
      <Navbar />
      <div className="container">
        <img src={conference_img} />
        <Card>
          <form>
            <Input name="email" label="Email" type="email" />
            <Input name="password" label="Hasło" type="password" />
            <Button type="submit" name="Zaloguj się" />
          </form>
        </Card>
      </div>
    </>
  );
}
