import "./SessionGoodbye.scss";

import Confetti from "react-confetti";
import Navbar from "../Navbar/LoginNavbar/Navbar";
import { ReactElement } from "react";
import { Typography } from "@material-ui/core";
import logo from "../../assets/images/logo.png";
import { useTranslation } from "react-i18next";
import { useWindowSize } from "../../hooks/useWindowSize";

export function SessionGoodbye(): ReactElement {
  const { t } = useTranslation("common");
  const { width, height } = useWindowSize();

  return (
    <>
      <Navbar />
      <div className="SessionGoodbye">
        <img src={logo} alt="logo" />
        <Typography variant="h4" className="text">
          {t("components.SessionGoodbye.end")}
        </Typography>
        <Typography variant="h6" className="text">
          {t("components.SessionGoodbye.bye")}
        </Typography>
      </div>
      <Confetti
        numberOfPieces={800}
        recycle={false}
        width={width}
        height={height}
      />
    </>
  );
}
