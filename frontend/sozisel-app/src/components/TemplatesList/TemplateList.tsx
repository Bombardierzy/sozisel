import "./TemplateList.scss";
import MainNavbar from "../MainNavbar/MainNavbar";
import SearchBar from "./SearchBar/SearchBar";
import TemplateCard from "./TemplateCard/TemplateCard";
import { ReactElement } from "react";
import List from "@material-ui/core/List";
import { useTranslation } from "react-i18next";
import { useSearchSessionTemplatesQuery } from "../../graphql";

const mockTemplate = [
  {
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
    insertedAt: null,
    updatedAt: null,
  },
  {
    id: "ab",
    estimatedTime: 50,
    isPublic: true,
    name: "ASD",
    owner: {
      email: "kowalski@jan.pl",
      firstName: "Jan",
      lastName: "Bomba",
      id: "id",
    },
    agendaEntries: [],
    insertedAt: null,
    updatedAt: null,
  },
];

export default function TemplateList(): ReactElement {
  const { t } = useTranslation("common");
  const { data, loading, error, refetch } = useSearchSessionTemplatesQuery();

  const onSearch = (name: string, includePublic: boolean) => {
    refetch({ name, includePublic });
  };

  if (loading) {
    return (
      <>
        <MainNavbar></MainNavbar>
      </>
    );
  }

  if (data?.searchSessionTemplates) {
    return (
      <>
        <MainNavbar></MainNavbar>
        <div className="TemplateListContainer">
          <SearchBar onSearch={onSearch}></SearchBar>
          <div className="TemplatesList">
            <List>
              {data.searchSessionTemplates.map((element, index) => (
                <TemplateCard template={element} />
              ))}
            </List>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <MainNavbar></MainNavbar>
    </>
  );
}
