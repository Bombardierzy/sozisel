import "./TemplateList.scss";
import MainNavbar from "../MainNavbar/MainNavbar";
import SearchBar from "./SearchBar/SearchBar";
import TemplateCard from "./TemplateCard/TemplateCard";
import { ReactElement } from "react";
import List from "@material-ui/core/List";
import { useTranslation } from "react-i18next";
import { useSearchSessionTemplatesQuery } from "../../graphql";
import CircularProgress from "@material-ui/core/CircularProgress";
import Alert from "@material-ui/lab/Alert";
import { useState } from "react";

export default function TemplateList(): ReactElement {
  const { t } = useTranslation("common");
  const { data, loading, error, refetch } = useSearchSessionTemplatesQuery();
  const [name, setName] = useState<string>("");
  const [includePublic, setIncludePublic] = useState<boolean>(false);

  const onSearch = ({
    nameSearch = name,
    includePublicSearch = includePublic,
  }: {
    nameSearch?: string;
    includePublicSearch?: boolean;
  }) => {
    refetch({ name: nameSearch, includePublic: includePublicSearch });
    setName(nameSearch);
    setIncludePublic(includePublicSearch);
  };

  if (loading) {
    return (
      <>
        <MainNavbar></MainNavbar>
        <div className="TemplateListContainer">
          <SearchBar onSearch={onSearch}></SearchBar>
          <div className="ContentContainer">
            <CircularProgress />
          </div>
        </div>
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
                <TemplateCard template={element} refetch={onSearch} />
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
      <div className="TemplateListContainer">
        <SearchBar onSearch={onSearch}></SearchBar>
        <Alert className="ErrorAlert" variant="outlined" severity="error">
          {t("components.TemplatesList.errorMsg")}
        </Alert>
      </div>
    </>
  );
}
