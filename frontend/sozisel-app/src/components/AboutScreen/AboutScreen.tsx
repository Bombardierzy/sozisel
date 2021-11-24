import "./AboutScreen.scss";

import React, { ReactElement } from "react";

import Navbar from "../Navbar/LoginNavbar/Navbar";
import conference_img from "../../assets/images/conference_img.png";
import { useTranslation } from "react-i18next";

export default function AboutScreen(): ReactElement {
  const { t } = useTranslation("common");

  return (
    <>
      <Navbar />
      <div className="AboutScreen">
        <img src={conference_img} />
        <div className="text">
          <h2>SOZISEL</h2>
          <p>Czyli w skrócie...</p>
          <p>
            <b>S</b>ystem <b>O</b>rganizacji <b>Z</b>różnicowanych <b>I</b>
            nteraktywnych <b>S</b>esji <b>E</b>-<b>L</b>earningowych
          </p>
          <p>{t("components.AboutScreen.projectDescription")}</p>
          <h4>{t("components.AboutScreen.header")}</h4>
          <ul>
            {t("components.AboutScreen.projectScope")
              .split(";")
              .map((element, idx) => (
                <li key={idx}>{element}</li>
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
