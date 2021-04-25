import "./TemplateList.scss";
import MainNavbar from "../MainNavbar/MainNavbar";
import SearchBar from "./SearchBar/SearchBar";
import TemplateCard from "./TemplateCard/TemplateCard";
import { ReactElement } from "react";

import { useTranslation } from "react-i18next";
import { useState } from "react";

const mockTemplate = {
  id: "aa",
  estimatedTime: 50,
  isPublic: false,
  name: "Sieci komputerowe",
  owner: {
    email: "kowalski@jan.pl",
    firstName: "Jan",
    lastName: "Kowalski",
    id: "id",
  },
  agendaEntries: [],
};

export default function TemplateList(): ReactElement {
  const { t } = useTranslation("common");
  const [template, setTemplate] = useState(mockTemplate);

  return (
    <>
      <MainNavbar></MainNavbar>
      <div className="TemplateListContainer">
        <SearchBar></SearchBar>
        <div className="TemplatesList">
          <TemplateCard template={template}></TemplateCard>
        </div>
      </div>
    </>
  );
}
