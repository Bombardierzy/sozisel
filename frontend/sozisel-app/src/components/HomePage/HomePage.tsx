import { ReactElement } from "react";
import { useTranslation } from "react-i18next";

export default function HomePage(): ReactElement {
  const { t } = useTranslation("common");
  return <>{t("components.HomePage.placeholder")}</>;
}
