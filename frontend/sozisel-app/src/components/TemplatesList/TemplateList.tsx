import "./TemplateList.scss";

import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import {
  SessionTemplate,
  useCloneSessionTemplateMutation,
  useDeleteSessionTemplateMutation,
  useSearchSessionTemplatesQuery,
} from "../../graphql";

import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import MainNavbar from "../MainNavbar/MainNavbar";
import { ReactElement } from "react";
import SearchBar from "./SearchBar/SearchBar";
import Snackbar from "@material-ui/core/Snackbar";
import TemplateCard from "./TemplateCard/TemplateCard";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function TemplateList(): ReactElement {
  const { t } = useTranslation("common");
  const { data, loading, error, refetch } = useSearchSessionTemplatesQuery({
    fetchPolicy: "network-only",
  });
  const [name, setName] = useState<string>("");
  const [includePublic, setIncludePublic] = useState<boolean>(false);
  const [
    cloneMutation,
    { error: cloneError, loading: cloneLoading },
  ] = useCloneSessionTemplateMutation();
  const [
    deleteMutation,
    { error: deleteError, loading: deleteLoading },
  ] = useDeleteSessionTemplateMutation();
  const [successMsg, setSuccessMsg] = useState<string>("");

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

  const onCopy = async (template: SessionTemplate) => {
    try {
      await cloneMutation({
        variables: {
          id: template.id,
        },
      });
      refetch({ name: name, includePublic: includePublic });
      setSuccessMsg(`${t("components.TemplatesList.copySuccess")}`);
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async (template: SessionTemplate) => {
    try {
      await deleteMutation({
        variables: {
          id: template.id,
        },
      });
      refetch({ name: name, includePublic: includePublic });
      setSuccessMsg(`${t("components.TemplatesList.deleteSuccess")}`);
    } catch (error) {
      console.error(error);
    }
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
                <TemplateCard
                  template={element}
                  onCopy={onCopy}
                  onDelete={onDelete}
                />
              ))}
            </List>
          </div>
        </div>
        <Snackbar
          open={successMsg !== ""}
          autoHideDuration={6000}
          onClose={() => setSuccessMsg("")}
        >
          <Alert onClose={() => setSuccessMsg("")} severity="success">
            {successMsg}
          </Alert>
        </Snackbar>
        <Snackbar open={cloneLoading || deleteLoading} autoHideDuration={3000}>
          <CircularProgress />
        </Snackbar>
        <Snackbar open={!!cloneError || !!deleteError} autoHideDuration={6000}>
          <Alert severity="error">
            {t("components.TemplatesList.errorMsg")}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <MainNavbar></MainNavbar>
      <div className="TemplateListContainer">
        <SearchBar onSearch={onSearch}></SearchBar>
        <Alert className="ErrorAlert" variant="outlined" severity="error">
          {t("components.TemplatesList.fetchingErrorMsg")}
        </Alert>
      </div>
    </>
  );
}
