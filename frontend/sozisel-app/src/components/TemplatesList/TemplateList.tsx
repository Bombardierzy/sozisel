import "./TemplateList.scss";

import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { ReactElement, useCallback, useState } from "react";
import {
  useCloneSessionTemplateMutation,
  useDeleteSessionTemplateMutation,
  useSearchSessionTemplatesQuery,
} from "../../graphql";

import { AUTO_HIDE_DURATION } from "../../common/globals";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import MainNavbar from "../MainNavbar/MainNavbar";
import SearchBar from "./SearchBar/SearchBar";
import { SessionTemplate } from "../../model/Template";
import Snackbar from "@material-ui/core/Snackbar";
import TemplateCard from "./TemplateCard/TemplateCard";
import { useTranslation } from "react-i18next";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function TemplateList(): ReactElement {
  const { t } = useTranslation("common");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [includePublic, setIncludePublic] = useState<boolean>(false);

  const { data, loading, refetch } = useSearchSessionTemplatesQuery({
    fetchPolicy: "network-only",
  });

  const [
    cloneMutation,
    { error: cloneError, loading: cloneLoading },
  ] = useCloneSessionTemplateMutation();
  const [
    deleteMutation,
    { error: deleteError, loading: deleteLoading },
  ] = useDeleteSessionTemplateMutation();

  const onSearch = useCallback(
    ({
      nameSearch = name,
      includePublicSearch = includePublic,
    }: {
      nameSearch?: string;
      includePublicSearch?: boolean;
    }) => {
      refetch({ name: nameSearch, includePublic: includePublicSearch });
      setName(nameSearch);
      setIncludePublic(includePublicSearch);
    },
    [includePublic, name, refetch]
  );

  const onCopy = useCallback(
    async (template: SessionTemplate) => {
      try {
        await cloneMutation({
          variables: {
            id: template.id,
          },
        });
        refetch({ name: name, includePublic: includePublic });
        setSuccessMessage(`${t("components.TemplatesList.copySuccess")}`);
      } catch (error) {
        console.error(error);
      }
    },
    [includePublic, name, refetch, cloneMutation, t]
  );

  const onDelete = useCallback(
    async (template: SessionTemplate) => {
      try {
        await deleteMutation({
          variables: {
            id: template.id,
          },
        });
        refetch({ name: name, includePublic: includePublic });
        setSuccessMessage(`${t("components.TemplatesList.deleteSuccess")}`);
      } catch (error) {
        console.error(error);
      }
    },
    [includePublic, name, refetch, deleteMutation, t]
  );

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
              {data.searchSessionTemplates.map((element) => (
                <TemplateCard
                  key={element.id}
                  template={element}
                  onCopy={onCopy}
                  onDelete={onDelete}
                />
              ))}
            </List>
          </div>
        </div>
        <Snackbar
          open={successMessage !== ""}
          autoHideDuration={AUTO_HIDE_DURATION}
          onClose={() => setSuccessMessage("")}
        >
          <Alert onClose={() => setSuccessMessage("")} severity="success">
            {successMessage}
          </Alert>
        </Snackbar>
        <Snackbar
          open={cloneLoading || deleteLoading}
          autoHideDuration={AUTO_HIDE_DURATION}
        >
          <CircularProgress />
        </Snackbar>
        <Snackbar
          open={!!cloneError || !!deleteError}
          autoHideDuration={AUTO_HIDE_DURATION}
        >
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
